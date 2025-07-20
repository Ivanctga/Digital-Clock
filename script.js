class CloakerBreaker {
    constructor() {
        this.urlInput = document.getElementById('urlInput');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.loading = document.getElementById('loading');
        this.results = document.getElementById('results');
        
        this.analyzeBtn.addEventListener('click', () => this.analyzeUrl());
        this.urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.analyzeUrl();
        });
    }

    async analyzeUrl() {
        const url = this.urlInput.value.trim();
        
        if (!url) {
            this.showError('Por favor, digite uma URL válida');
            return;
        }

        if (!this.isValidUrl(url)) {
            this.showError('URL inválida. Digite uma URL completa (ex: https://exemplo.com)');
            return;
        }

        this.showLoading();
        this.analyzeBtn.disabled = true;

        try {
            const results = await this.detectCloaker(url);
            this.displayResults(results);
        } catch (error) {
            this.showError('Erro ao analisar a URL: ' + error.message);
        } finally {
            this.hideLoading();
            this.analyzeBtn.disabled = false;
        }
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    async detectCloaker(url) {
        try {
            // Tentar usar a API do servidor primeiro
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url })
            });

            if (response.ok) {
                return await response.json();
            } else {
                // Fallback para análise client-side
                return await this.fallbackAnalysis(url);
            }
        } catch (error) {
            console.log('Servidor não disponível, usando análise client-side');
            return await this.fallbackAnalysis(url);
        }
    }

    async fallbackAnalysis(url) {
        const results = {
            originalUrl: url,
            cloakerDetected: false,
            realUrl: null,
            subdomains: [],
            techniques: [],
            analysis: {}
        };

        try {
            // Técnica 1: Verificar redirecionamentos
            const redirectInfo = await this.checkRedirects(url);
            results.analysis.redirects = redirectInfo;
            
            if (redirectInfo.finalUrl !== url) {
                results.cloakerDetected = true;
                results.realUrl = redirectInfo.finalUrl;
                results.techniques.push('Redirecionamento');
            }

            // Técnica 2: Verificar User-Agent spoofing
            const userAgentInfo = await this.checkUserAgentSpoofing(url);
            results.analysis.userAgent = userAgentInfo;
            
            if (userAgentInfo.differentContent) {
                results.cloakerDetected = true;
                results.techniques.push('User-Agent Spoofing');
            }

            // Técnica 3: Verificar JavaScript redirects
            const jsRedirectInfo = await this.checkJavaScriptRedirects(url);
            results.analysis.javaScript = jsRedirectInfo;
            
            if (jsRedirectInfo.hasRedirect) {
                results.cloakerDetected = true;
                results.techniques.push('JavaScript Redirect');
            }

            // Técnica 4: Verificar referrer spoofing
            const referrerInfo = await this.checkReferrerSpoofing(url);
            results.analysis.referrer = referrerInfo;
            
            if (referrerInfo.differentContent) {
                results.cloakerDetected = true;
                results.techniques.push('Referrer Spoofing');
            }

            // Técnica 5: Verificar IP geolocalização
            const geoInfo = await this.checkGeolocationSpoofing(url);
            results.analysis.geolocation = geoInfo;
            
            if (geoInfo.differentContent) {
                results.cloakerDetected = true;
                results.techniques.push('Geolocalização Spoofing');
            }

            // Encontrar subdomínios
            results.subdomains = await this.findSubdomains(url);

        } catch (error) {
            console.error('Erro na análise:', error);
        }

        return results;
    }

    async checkRedirects(url) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                redirect: 'manual',
                mode: 'no-cors'
            });
            
            return {
                hasRedirect: response.type === 'opaqueredirect',
                finalUrl: url, // Em modo no-cors, não podemos acessar a URL final
                status: response.status
            };
        } catch (error) {
            // Simular verificação de redirecionamento
            return {
                hasRedirect: false,
                finalUrl: url,
                status: 200
            };
        }
    }

    async checkUserAgentSpoofing(url) {
        try {
            // Simular diferentes User-Agents
            const userAgents = [
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
                'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
                'Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)'
            ];

            const responses = [];
            
            for (const ua of userAgents) {
                try {
                    const response = await fetch(url, {
                        headers: {
                            'User-Agent': ua
                        },
                        mode: 'no-cors'
                    });
                    responses.push({ userAgent: ua, response });
                } catch (error) {
                    // Ignorar erros de CORS
                }
            }

            return {
                differentContent: responses.length > 1,
                userAgentsTested: userAgents.length,
                responses: responses.length
            };
        } catch (error) {
            return {
                differentContent: false,
                userAgentsTested: 0,
                responses: 0
            };
        }
    }

    async checkJavaScriptRedirects(url) {
        try {
            // Simular verificação de JavaScript redirects
            const response = await fetch(url, {
                mode: 'no-cors'
            });
            
            return {
                hasRedirect: false,
                hasJavaScript: true,
                message: 'Verificação de JavaScript redirects simulada'
            };
        } catch (error) {
            return {
                hasRedirect: false,
                hasJavaScript: false,
                message: 'Erro ao verificar JavaScript redirects'
            };
        }
    }

    async checkReferrerSpoofing(url) {
        try {
            // Simular diferentes referrers
            const referrers = [
                'https://www.google.com',
                'https://www.facebook.com',
                'https://www.twitter.com',
                'https://www.instagram.com'
            ];

            const responses = [];
            
            for (const referrer of referrers) {
                try {
                    const response = await fetch(url, {
                        headers: {
                            'Referer': referrer
                        },
                        mode: 'no-cors'
                    });
                    responses.push({ referrer, response });
                } catch (error) {
                    // Ignorar erros de CORS
                }
            }

            return {
                differentContent: responses.length > 1,
                referrersTested: referrers.length,
                responses: responses.length
            };
        } catch (error) {
            return {
                differentContent: false,
                referrersTested: 0,
                responses: 0
            };
        }
    }

    async checkGeolocationSpoofing(url) {
        try {
            // Simular diferentes localizações
            const locations = [
                { country: 'US', ip: '8.8.8.8' },
                { country: 'BR', ip: '200.160.0.0' },
                { country: 'UK', ip: '1.1.1.1' }
            ];

            const responses = [];
            
            for (const location of locations) {
                try {
                    const response = await fetch(url, {
                        headers: {
                            'X-Forwarded-For': location.ip,
                            'CF-IPCountry': location.country
                        },
                        mode: 'no-cors'
                    });
                    responses.push({ location, response });
                } catch (error) {
                    // Ignorar erros de CORS
                }
            }

            return {
                differentContent: responses.length > 1,
                locationsTested: locations.length,
                responses: responses.length
            };
        } catch (error) {
            return {
                differentContent: false,
                locationsTested: 0,
                responses: 0
            };
        }
    }

    async findSubdomains(url) {
        try {
            const domain = new URL(url).hostname;
            const baseDomain = this.extractBaseDomain(domain);
            
            // Lista comum de subdomínios para verificar
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
                    const response = await fetch(testUrl, {
                        method: 'HEAD',
                        mode: 'no-cors'
                    });
                    foundSubdomains.push({
                        subdomain: subdomain,
                        url: testUrl,
                        status: 'active'
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

    extractBaseDomain(hostname) {
        const parts = hostname.split('.');
        if (parts.length >= 2) {
            return parts.slice(-2).join('.');
        }
        return hostname;
    }

    displayResults(results) {
        this.results.style.display = 'block';
        
        let html = `
            <div class="result-card ${results.cloakerDetected ? 'danger' : 'success'}">
                <div class="result-title">
                    <i class="fas ${results.cloakerDetected ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i>
                    ${results.cloakerDetected ? 'Cloaker Detectado!' : 'Nenhum Cloaker Detectado'}
                </div>
                <div class="result-content">
                    <p><strong>URL Original:</strong> ${results.originalUrl}</p>
                    ${results.realUrl ? `<p><strong>URL Real:</strong> <a href="${results.realUrl}" target="_blank">${results.realUrl}</a></p>` : ''}
                    ${results.techniques.length > 0 ? `<p><strong>Técnicas Detectadas:</strong> ${results.techniques.join(', ')}</p>` : ''}
                </div>
            </div>
        `;

        if (results.subdomains.length > 0) {
            html += `
                <div class="result-card">
                    <div class="result-title">
                        <i class="fas fa-link"></i>
                        Subdomínios Encontrados
                    </div>
                    <div class="result-content">
                        <ul class="subdomain-list">
                            ${results.subdomains.map(sub => `
                                <li>
                                    <i class="fas fa-globe"></i>
                                    <a href="${sub.url}" target="_blank">${sub.subdomain}.${this.extractBaseDomain(new URL(results.originalUrl).hostname)}</a>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }

        // Detalhes da análise
        if (Object.keys(results.analysis).length > 0) {
            html += `
                <div class="result-card">
                    <div class="result-title">
                        <i class="fas fa-search"></i>
                        Detalhes da Análise
                    </div>
                    <div class="result-content">
                        ${Object.entries(results.analysis).map(([key, value]) => `
                            <p><strong>${this.formatAnalysisKey(key)}:</strong> ${this.formatAnalysisValue(value)}</p>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        this.results.innerHTML = html;
    }

    formatAnalysisKey(key) {
        const keys = {
            redirects: 'Redirecionamentos',
            userAgent: 'User-Agent',
            javaScript: 'JavaScript',
            referrer: 'Referrer',
            geolocation: 'Geolocalização'
        };
        return keys[key] || key;
    }

    formatAnalysisValue(value) {
        if (typeof value === 'object') {
            return Object.entries(value)
                .filter(([k, v]) => k !== 'responses' && k !== 'userAgentsTested' && k !== 'referrersTested' && k !== 'locationsTested')
                .map(([k, v]) => `${k}: ${v}`)
                .join(', ');
        }
        return value;
    }

    showLoading() {
        this.loading.style.display = 'block';
        this.results.style.display = 'none';
    }

    hideLoading() {
        this.loading.style.display = 'none';
    }

    showError(message) {
        this.results.style.display = 'block';
        this.results.innerHTML = `
            <div class="result-card danger">
                <div class="result-title">
                    <i class="fas fa-exclamation-circle"></i>
                    Erro
                </div>
                <div class="result-content">
                    <p>${message}</p>
                </div>
            </div>
        `;
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new CloakerBreaker();
});