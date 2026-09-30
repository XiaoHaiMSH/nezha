# SPDX-License-Identifier: Apache-2.0

include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-nezha-dashboard
PKG_VERSION:=1.0.0
PKG_RELEASE:=1

PKG_LICENSE:=Apache-2.0
PKG_MAINTAINER:=Your Name <you@example.com>

LUCI_TITLE:=LuCI support for Nezha Dashboard
LUCI_DESCRIPTION:=LuCI configuration page for Nezha Monitoring V2 Dashboard
LUCI_DEPENDS:=+nezha-dashboard
LUCI_PKGARCH:=all

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
