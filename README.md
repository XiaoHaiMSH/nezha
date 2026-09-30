# Nezha Dashboard for OpenWrt

- `nezha-dashboard/`          backend: installs the official prebuilt Dashboard binary (amd64 / arm64), procd init script, UCI config
- `luci-app-nezha-dashboard/` LuCI: Services -> Nezha Dashboard

## Build (inside an OpenWrt / ImmortalWrt source tree)
    cp -r nezha-dashboard luci-app-nezha-dashboard package/
    make menuconfig   # Network -> Web Servers/Proxies -> nezha-dashboard ; LuCI -> Applications -> luci-app-nezha-dashboard
    make package/nezha-dashboard/download V=s   # prints real PKG_HASH -> put into Makefile
    make package/nezha-dashboard/compile V=s
    make package/luci-app-nezha-dashboard/compile V=s

## First start
    uci set nezha-dashboard.main.enabled='1'
    uci set nezha-dashboard.main.install_host='ddns.example.com:8008'
    uci set nezha-dashboard.main.open_wan='1'     # only if servers connect over the Internet
    uci commit nezha-dashboard && /etc/init.d/nezha-dashboard restart
Panel: http://<router-ip>:8008/ , default login admin / admin (change it).
In the panel: Settings -> "Agent connect address" = same host:port, then
Servers -> "Install command" and run it on the other server.
