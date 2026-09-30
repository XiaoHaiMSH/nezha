# SPDX-License-Identifier: Apache-2.0

include $(TOPDIR)/rules.mk

PKG_NAME:=nezha-dashboard
PKG_VERSION:=2.3.14
PKG_RELEASE:=1

ifeq ($(ARCH),x86_64)
  NEZHA_ARCH:=amd64
else ifeq ($(ARCH),aarch64)
  NEZHA_ARCH:=arm64
endif

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION)-$(NEZHA_ARCH).zip
PKG_SOURCE_URL:=https://github.com/nezhahq/nezha/releases/download/v$(PKG_VERSION)/
PKG_SOURCE_URL_FILE:=dashboard-linux-$(NEZHA_ARCH).zip
PKG_HASH:=skip
PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)-$(PKG_VERSION)

PKG_LICENSE:=Apache-2.0
PKG_MAINTAINER:=Your Name <you@example.com>

include $(INCLUDE_DIR)/package.mk

define Package/nezha-dashboard
  SECTION:=net
  CATEGORY:=Network
  SUBMENU:=Web Servers/Proxies
  TITLE:=Nezha Monitoring V2 Dashboard
  URL:=https://nezha.wiki/
  DEPENDS:=@(aarch64||x86_64) +ca-bundle +zoneinfo-core +zoneinfo-asia
endef

define Package/nezha-dashboard/description
  Dashboard (server side) of Nezha Monitoring V2.
endef

define Package/nezha-dashboard/conffiles
/etc/config/nezha-dashboard
/etc/nezha-dashboard/
endef

define Build/Prepare
	mkdir -p $(PKG_BUILD_DIR)
	unzip -o -q $(DL_DIR)/$(PKG_SOURCE) -d $(PKG_BUILD_DIR)
endef

define Build/Configure
endef

define Build/Compile
endef

define Package/nezha-dashboard/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/dashboard-linux-$(NEZHA_ARCH) $(1)/usr/bin/nezha-dashboard

	$(INSTALL_DIR) $(1)/etc/config
	$(INSTALL_CONF) ./files/nezha-dashboard.conf $(1)/etc/config/nezha-dashboard

	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) ./files/nezha-dashboard.init $(1)/etc/init.d/nezha-dashboard
endef

$(eval $(call BuildPackage,nezha-dashboard))
