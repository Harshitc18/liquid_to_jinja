class LiquidToJinjaConverter {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.loadExampleCode();
    }

    initializeElements() {
        // Input elements
        this.liquidInput = document.getElementById('liquidInput');
        this.jinjaOutput = document.getElementById('jinjaOutput');
        this.convertBtn = document.getElementById('convertBtn');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        
        // Action buttons
        this.clearInputBtn = document.getElementById('clearInput');
        this.loadExampleBtn = document.getElementById('loadExample');
        this.copyOutputBtn = document.getElementById('copyOutput');
        this.downloadOutputBtn = document.getElementById('downloadOutput');
        
        // Info elements
        this.inputLines = document.getElementById('inputLines');
        this.inputChars = document.getElementById('inputChars');
        this.outputLines = document.getElementById('outputLines');
        this.outputChars = document.getElementById('outputChars');
        
        // Modal and toast elements
        this.toast = document.getElementById('toast');
        this.toastMessage = document.getElementById('toastMessage');
        this.errorModal = document.getElementById('errorModal');
        this.errorMessage = document.getElementById('errorMessage');
        this.modalCloseButtons = document.querySelectorAll('.modal-close');
    }

    bindEvents() {
        // Convert button
        this.convertBtn.addEventListener('click', () => this.convertCode());
        
        // Action buttons
        this.clearInputBtn.addEventListener('click', () => this.clearInput());
        this.loadExampleBtn.addEventListener('click', () => this.loadExample());
        this.copyOutputBtn.addEventListener('click', () => this.copyOutput());
        this.downloadOutputBtn.addEventListener('click', () => this.downloadOutput());
        
        // Input events
        this.liquidInput.addEventListener('input', () => this.updateInputStats());
        this.liquidInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Modal events
        this.modalCloseButtons.forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
        
        this.errorModal.addEventListener('click', (e) => {
            if (e.target === this.errorModal) {
                this.closeModal();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleGlobalKeydown(e));
        
        // Initial stats update
        this.updateInputStats();
    }

    loadExampleCode() {
        const exampleCode = `{% assign user_name = 'John Doe' %}
{% assign age = 25 %}
{% assign products = 'apple,banana,orange' | split: ',' %}

{% comment %}Welcome message with user details{% endcomment %}
{% if user_name contains 'John' %}
  <h1>Hello {{ user_name | upcase }}!</h1>
  <p>You are {{ age }} years old.</p>
{% else %}
  <h1>Welcome, Guest!</h1>
{% endif %}

{% unless products == empty %}
  <h2>Available Products:</h2>
  <ul>
  {% for product in products %}
    <li>{{ product | capitalize | truncate: 15 }}</li>
  {% endfor %}
  </ul>
{% endunless %}

{% case user_name %}
  {% when 'John Doe' %}
    <p>Premium member benefits apply!</p>
  {% when 'Jane Smith' %}
    <p>Standard member benefits apply!</p>
  {% else %}
    <p>Basic member benefits apply!</p>
{% endcase %}

{% capture greeting %}
  Hello {{ user_name }}, today is {{ 'now' | date: '%Y-%m-%d' }}
{% endcapture %}

<div class="greeting">{{ greeting }}</div>

{% assign discounted_price = 100 | minus: 10 %}
<p>Special price: ${{ discounted_price }}</p>`;

        this.exampleCode = exampleCode;
    }

    handleKeydown(e) {
        // Tab support in textarea
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.liquidInput.selectionStart;
            const end = this.liquidInput.selectionEnd;
            
            this.liquidInput.value = 
                this.liquidInput.value.substring(0, start) + 
                '  ' + 
                this.liquidInput.value.substring(end);
            
            this.liquidInput.selectionStart = this.liquidInput.selectionEnd = start + 2;
            this.updateInputStats();
        }
    }

    handleGlobalKeydown(e) {
        // Ctrl/Cmd + Enter to convert
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            this.convertCode();
        }
        
        // Ctrl/Cmd + K to clear
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.clearInput();
        }
        
        // Escape to close modal
        if (e.key === 'Escape') {
            this.closeModal();
        }
    }

    updateInputStats() {
        const text = this.liquidInput.value;
        const lines = text ? text.split('\n').length : 0;
        const chars = text.length;
        
        this.inputLines.textContent = `${lines} line${lines !== 1 ? 's' : ''}`;
        this.inputChars.textContent = `${chars} character${chars !== 1 ? 's' : ''}`;
    }

    updateOutputStats(text) {
        const lines = text ? text.split('\n').length : 0;
        const chars = text.length;
        
        this.outputLines.textContent = `${lines} line${lines !== 1 ? 's' : ''}`;
        this.outputChars.textContent = `${chars} character${chars !== 1 ? 's' : ''}`;
    }

    async convertCode() {
        const liquidCode = this.liquidInput.value.trim();
        
        if (!liquidCode) {
            this.showError('Please enter some Liquid code to convert.');
            return;
        }

        this.setLoading(true);

        try {
            const response = await fetch('/convert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ liquid_code: liquidCode })
            });

            const data = await response.json();

            if (data.success) {
                this.displayResult(data.jinja_code);
                this.showToast('Conversion completed successfully!', 'success');
            } else {
                this.showError(data.error || 'Conversion failed. Please try again.');
            }
        } catch (error) {
            console.error('Conversion error:', error);
            this.showError('Network error. Please check your connection and try again.');
        } finally {
            this.setLoading(false);
        }
    }

    displayResult(jinjaCode) {
        const codeElement = this.jinjaOutput.querySelector('code');
        codeElement.textContent = jinjaCode;
        
        // Apply syntax highlighting
        if (window.Prism) {
            Prism.highlightElement(codeElement);
        }
        
        this.updateOutputStats(jinjaCode);
        
        // Smooth scroll to output
        this.jinjaOutput.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
    }

    setLoading(isLoading) {
        if (isLoading) {
            this.convertBtn.disabled = true;
            this.convertBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Converting...';
            this.loadingSpinner.classList.add('show');
        } else {
            this.convertBtn.disabled = false;
            this.convertBtn.innerHTML = '<i class="fas fa-exchange-alt"></i> Convert to Jinja';
            this.loadingSpinner.classList.remove('show');
        }
    }

    clearInput() {
        this.liquidInput.value = '';
        this.liquidInput.focus();
        this.updateInputStats();
        
        // Clear output
        const codeElement = this.jinjaOutput.querySelector('code');
        codeElement.textContent = 'Your converted Jinja2 code will appear here...';
        this.updateOutputStats('');
        
        this.showToast('Input cleared', 'info');
    }

    loadExample() {
        this.liquidInput.value = this.exampleCode;
        this.updateInputStats();
        this.showToast('Example code loaded', 'info');
        
        // Auto-focus on input
        this.liquidInput.focus();
        this.liquidInput.setSelectionRange(0, 0);
    }

    async copyOutput() {
        const codeElement = this.jinjaOutput.querySelector('code');
        const text = codeElement.textContent;
        
        if (!text || text === 'Your converted Jinja2 code will appear here...') {
            this.showToast('No code to copy', 'warning');
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Code copied to clipboard!', 'success');
        } catch (error) {
            console.error('Copy failed:', error);
            
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                this.showToast('Code copied to clipboard!', 'success');
            } catch (fallbackError) {
                this.showToast('Failed to copy code', 'error');
            }
            
            document.body.removeChild(textArea);
        }
    }

    downloadOutput() {
        const codeElement = this.jinjaOutput.querySelector('code');
        const text = codeElement.textContent;
        
        if (!text || text === 'Your converted Jinja2 code will appear here...') {
            this.showToast('No code to download', 'warning');
            return;
        }

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted_template.j2';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('Template downloaded!', 'success');
    }

    showToast(message, type = 'success') {
        this.toastMessage.textContent = message;
        
        // Update toast icon based on type
        const icon = this.toast.querySelector('i');
        icon.className = this.getToastIcon(type);
        
        // Update toast color based on type
        this.toast.className = `toast ${type}`;
        this.toast.classList.add('show');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }

    getToastIcon(type) {
        switch (type) {
            case 'success':
                return 'fas fa-check-circle';
            case 'error':
                return 'fas fa-exclamation-circle';
            case 'warning':
                return 'fas fa-exclamation-triangle';
            case 'info':
                return 'fas fa-info-circle';
            default:
                return 'fas fa-check-circle';
        }
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorModal.classList.add('show');
    }

    closeModal() {
        this.errorModal.classList.remove('show');
    }

    // Utility method for debouncing
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Additional CSS classes for toast types
const additionalStyles = `
    .toast.success { background: var(--success-color); }
    .toast.error { background: var(--error-color); }
    .toast.warning { background: var(--warning-color); }
    .toast.info { background: var(--primary-color); }
`;

// Add additional styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LiquidToJinjaConverter();
});

// Service Worker registration for better caching (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment the following lines if you create a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(registrationError => console.log('SW registration failed'));
    });
}
