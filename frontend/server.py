import http.server
import socketserver
import os

PORT = 3000

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # If the path has a file extension, serve the file
        if '.' in self.path and os.path.exists(self.path[1:]):
            return http.server.SimpleHTTPRequestHandler.do_GET(self)
        # Otherwise serve index.html for SPA routing
        self.path = '/index.html'
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

with socketserver.TCPServer(('', PORT), SPAHandler) as httpd:
    print(f"✅ HomeLink running at http://localhost:{PORT}")
    print(f"📁 Press Ctrl+C to stop")
    httpd.serve_forever()
