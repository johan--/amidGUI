amidGUI
=======

Front end for AMID rest interface

Start AMID and configure reverse proxy in httpd.conf of apache 

Es:


ProxyPass           /mongo      http://localhost:3000

ProxyPassReverse    /mongo      http://localhost:3000


