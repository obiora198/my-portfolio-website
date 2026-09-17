export default function ThemeScript() {
  const scriptContent = `(function() {
    try {
      var getCookie = function(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
      };
      var savedTheme = localStorage.getItem('theme') || getCookie('theme');
      var savedPalette = localStorage.getItem('palette') || getCookie('palette');
      var theme = savedTheme === 'light' ? 'light' : 'dark';
      
      var root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      
      if (savedPalette) {
        root.setAttribute('data-palette', savedPalette);
      }
    } catch (e) {}
  })();`

  return (
    <script
      id="theme-initializer"
      dangerouslySetInnerHTML={{ __html: scriptContent }}
    />
  )
}
