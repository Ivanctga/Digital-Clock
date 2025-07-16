const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Rotas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API para análise de cloakers
app.post('/api/analyze', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'URL é obrigatória' });
        }

        const results = await analyzeCloaker(url);
        res.json(results);
        
    } catch (error) {
        console.error('Erro na análise:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

async function analyzeCloaker(url) {
    const results = {
        originalUrl: url,
        cloakerDetected: false,
        realUrl: null,
        subdomains: [],
        techniques: [],
        analysis: {}
    };

    try {
        // 1. Verificar redirecionamentos
        const redirectInfo = await checkRedirects(url);
        results.analysis.redirects = redirectInfo;
        
        if (redirectInfo.hasRedirect) {
            results.cloakerDetected = true;
            results.realUrl = redirectInfo.finalUrl;
            results.techniques.push('Redirecionamento');
        }

        // 2. Verificar User-Agent spoofing
        const userAgentInfo = await checkUserAgentSpoofing(url);
        results.analysis.userAgent = userAgentInfo;
        
        if (userAgentInfo.differentContent) {
            results.cloakerDetected = true;
            results.techniques.push('User-Agent Spoofing');
        }

        // 3. Verificar referrer spoofing
        const referrerInfo = await checkReferrerSpoofing(url);
        results.analysis.referrer = referrerInfo;
        
        if (referrerInfo.differentContent) {
            results.cloakerDetected = true;
            results.techniques.push('Referrer Spoofing');
        }

        // 4. Verificar geolocalização
        const geoInfo = await checkGeolocationSpoofing(url);
        results.analysis.geolocation = geoInfo;
        
        if (geoInfo.differentContent) {
            results.cloakerDetected = true;
            results.techniques.push('Geolocalização Spoofing');
        }

        // 5. Encontrar subdomínios
        results.subdomains = await findSubdomains(url);

    } catch (error) {
        console.error('Erro na análise:', error);
    }

    return results;
}

async function checkRedirects(url) {
    try {
        const response = await axios.get(url, {
            maxRedirects: 0,
            validateStatus: function (status) {
                return status >= 200 && status < 400;
            }
        });
        
        return {
            hasRedirect: false,
            finalUrl: url,
            status: response.status
        };
    } catch (error) {
        if (error.response && error.response.status >= 300 && error.response.status < 400) {
            const location = error.response.headers.location;
            return {
                hasRedirect: true,
                finalUrl: location,
                status: error.response.status
            };
        }
        
        return {
            hasRedirect: false,
            finalUrl: url,
            status: 200
        };
    }
}

async function checkUserAgentSpoofing(url) {
    const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)'
    ];

    const responses = [];
    
    for (const ua of userAgents) {
        try {
            const response = await axios.get(url, {
                headers: { 'User-Agent': ua },
                timeout: 5000
            });
            responses.push({
                userAgent: ua,
                status: response.status,
                contentLength: response.data.length
            });
        } catch (error) {
            // Ignorar erros
        }
    }

    // Verificar se há diferenças significativas nas respostas
    const contentLengths = responses.map(r => r.contentLength);
    const uniqueLengths = [...new Set(contentLengths)];
    
    return {
        differentContent: uniqueLengths.length > 1,
        userAgentsTested: userAgents.length,
        responses: responses.length,
        uniqueContentLengths: uniqueLengths.length
    };
}

async function checkReferrerSpoofing(url) {
    const referrers = [
        'https://www.google.com',
        'https://www.facebook.com',
        'https://www.twitter.com',
        'https://www.instagram.com',
        'https://www.youtube.com'
    ];

    const responses = [];
    
    for (const referrer of referrers) {
        try {
            const response = await axios.get(url, {
                headers: { 'Referer': referrer },
                timeout: 5000
            });
            responses.push({
                referrer: referrer,
                status: response.status,
                contentLength: response.data.length
            });
        } catch (error) {
            // Ignorar erros
        }
    }

    const contentLengths = responses.map(r => r.contentLength);
    const uniqueLengths = [...new Set(contentLengths)];
    
    return {
        differentContent: uniqueLengths.length > 1,
        referrersTested: referrers.length,
        responses: responses.length,
        uniqueContentLengths: uniqueLengths.length
    };
}

async function checkGeolocationSpoofing(url) {
    const locations = [
        { country: 'US', ip: '8.8.8.8' },
        { country: 'BR', ip: '200.160.0.0' },
        { country: 'UK', ip: '1.1.1.1' },
        { country: 'DE', ip: '9.9.9.9' }
    ];

    const responses = [];
    
    for (const location of locations) {
        try {
            const response = await axios.get(url, {
                headers: {
                    'X-Forwarded-For': location.ip,
                    'CF-IPCountry': location.country,
                    'X-Real-IP': location.ip
                },
                timeout: 5000
            });
            responses.push({
                location: location,
                status: response.status,
                contentLength: response.data.length
            });
        } catch (error) {
            // Ignorar erros
        }
    }

    const contentLengths = responses.map(r => r.contentLength);
    const uniqueLengths = [...new Set(contentLengths)];
    
    return {
        differentContent: uniqueLengths.length > 1,
        locationsTested: locations.length,
        responses: responses.length,
        uniqueContentLengths: uniqueLengths.length
    };
}

async function findSubdomains(url) {
    try {
        const domain = new URL(url).hostname;
        const baseDomain = extractBaseDomain(domain);
        
        const commonSubdomains = [
            'www', 'mail', 'ftp', 'admin', 'blog', 'shop', 'store',
            'api', 'cdn', 'static', 'img', 'images', 'media',
            'support', 'help', 'docs', 'forum', 'community',
            'dev', 'test', 'staging', 'beta', 'alpha'
        ];

        const foundSubdomains = [];
        
        for (const subdomain of commonSubdomains) {
            const testUrl = `https://${subdomain}.${baseDomain}`;
            try {
                const response = await axios.head(testUrl, {
                    timeout: 3000
                });
                foundSubdomains.push({
                    subdomain: subdomain,
                    url: testUrl,
                    status: 'active',
                    responseStatus: response.status
                });
            } catch (error) {
                // Subdomínio não existe ou não responde
            }
        }

        return foundSubdomains;
    } catch (error) {
        return [];
    }
}

function extractBaseDomain(hostname) {
    const parts = hostname.split('.');
    if (parts.length >= 2) {
        return parts.slice(-2).join('.');
    }
    return hostname;
}

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Cloaker Breaker rodando na porta ${PORT}`);
    console.log(`📱 Acesse: http://localhost:${PORT}`);
});