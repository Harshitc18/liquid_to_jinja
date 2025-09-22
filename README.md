# Liquid to Jinja Converter

A beautiful web application that converts Liquid template syntax to Jinja2 format with an intuitive, modern interface.

![Liquid to Jinja Converter](https://img.shields.io/badge/Python-3.8%2B-blue)
![Flask](https://img.shields.io/badge/Flask-3.0.0-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Features

- 🎨 **Modern UI**: Beautiful, responsive design with dark theme
- ⚡ **Real-time Conversion**: Convert Liquid templates to Jinja2 instantly
- 🔧 **Smart Processing**: Handles complex filters, loops, conditions, and more
- 📋 **Copy & Download**: Easy copy to clipboard and download functionality
- 💡 **Examples**: Built-in example code to get started quickly
- 🎯 **Error Handling**: Clear error messages and validation
- ⌨️ **Keyboard Shortcuts**: Efficient workflow with shortcuts
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile

## Supported Conversions

### Template Syntax
- Variable assignments (`assign` → `set`)
- Comments (`comment` → `{# #}`)
- Conditionals (`if`, `elsif`, `else`, `unless`)
- Loops (`for` loops with proper syntax)
- Case statements → if/elif chains

### Filters
- String filters: `upcase`, `downcase`, `capitalize`, `strip`, `truncate`
- Array filters: `split`, `join`, `first`
- Math filters: `plus`, `minus`, `times`, `divided_by`, `modulo`
- Date filters: `date` formatting
- Custom filters: `replace`, `remove`, `slice`

### Advanced Features
- Custom attributes and user data conversion
- Capture blocks → set blocks
- Increment/decrement operations
- Number formatting
- Variable name sanitization (hyphens to underscores)

## Installation

1. **Clone or download** the project files to your desired directory

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**:
   ```bash
   python app.py
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:5000
   ```

## Usage

### Web Interface

1. **Enter Liquid Code**: Paste your Liquid template code in the left panel
2. **Convert**: Click the "Convert to Jinja" button or press `Ctrl+Enter`
3. **Review Output**: The converted Jinja2 code appears in the right panel
4. **Copy or Download**: Use the action buttons to copy or download the result

### Keyboard Shortcuts

- `Ctrl+Enter` (or `Cmd+Enter`): Convert code
- `Ctrl+K` (or `Cmd+K`): Clear input
- `Tab`: Insert spaces in textarea
- `Escape`: Close error modal

### Example Conversion

**Input (Liquid):**
```liquid
{% assign user_name = 'John Doe' %}
{% if user_name contains 'John' %}
  <h1>Hello {{ user_name | upcase }}!</h1>
{% endif %}

{% for product in products %}
  <p>{{ product.title | truncate: 50 }}</p>
{% endfor %}
```

**Output (Jinja2):**
```jinja2
{% set user_name = 'John Doe' %}
{% if 'John' in user_name %}
  <h1>Hello {{ user_name|upper }}!</h1>
{% endif %}

{% for product in products %}
  <p>{{ product.title[:50] }}</p>
{% endfor %}
```

## API Usage

The application also provides a REST API endpoint for programmatic access:

```bash
curl -X POST http://localhost:5000/convert \
  -H "Content-Type: application/json" \
  -d '{"liquid_code": "{{ user_name | upcase }}"}'
```

Response:
```json
{
  "success": true,
  "jinja_code": "{{ user_name|upper }}"
}
```

## Project Structure

```
liquid_to_jinja/
├── app.py                 # Flask application
├── liquid_to_jinja.py     # Core conversion logic
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css     # Styles and themes
│   └── js/
│       └── app.js        # Frontend JavaScript
└── README.md             # This file
```

## Customization

### Themes
The application uses CSS custom properties for easy theming. You can modify the color scheme in `static/css/style.css`:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --background: #0f0f23;
    /* ... other variables */
}
```

### Adding New Conversions
To add new conversion patterns, modify the `convert_liquid_to_jinja()` function in `liquid_to_jinja.py`.

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
python app.py --port 5001
```

**Module not found:**
```bash
pip install -r requirements.txt
```

**Conversion errors:**
- Check that your Liquid syntax is valid
- Review the error message in the modal
- Try with simpler code first

## Support

If you encounter any issues or have questions:

1. Check the browser console for JavaScript errors
2. Review the Flask application logs
3. Ensure all dependencies are installed correctly
4. Try the example code to verify the application is working

---

Built with ❤️ using Flask, JavaScript, and modern web technologies.
