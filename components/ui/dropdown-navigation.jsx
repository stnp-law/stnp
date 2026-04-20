"use client";

import React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import styles from "./dropdown-navigation.module.css";

function hrefMatchesPath(currentPath, href) {
  if (!href) return false;
  const normalizedHref = href.endsWith("/") && href !== "/" ? href.slice(0, -1) : href;
  const normalizedCurrent =
    currentPath.endsWith("/") && currentPath !== "/" ? currentPath.slice(0, -1) : currentPath;

  if (normalizedHref === normalizedCurrent) return true;

  const hrefDepth = normalizedHref.split("/").filter(Boolean).length;
  if (hrefDepth > 1 && normalizedCurrent.startsWith(`${normalizedHref}/`)) return true;

  return false;
}

function itemMatchesPath(item, currentPath) {
  if (hrefMatchesPath(currentPath, item.href)) return true;
  return (item.subMenus || []).some((group) =>
    group.items.some((subItem) => hrefMatchesPath(currentPath, subItem.href))
  );
}

export function DropdownNavigation({
  navItems = [],
  currentPath,
  getTransitionType,
  className = "",
}) {
  const [openMenu, setOpenMenu] = React.useState(null);
  const [hoveredId, setHoveredId] = React.useState(null);

  const handleLinkClick = (e, href) => {
    if (!href) return;
    const normalizedHref = href.endsWith("/") && href !== "/" ? href.slice(0, -1) : href;
    const normalizedCurrent = currentPath.endsWith("/") && currentPath !== "/" ? currentPath.slice(0, -1) : currentPath;

    if (normalizedHref === normalizedCurrent) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`${styles.navigation} ${className}`.trim()}
      aria-label="Primary navigation"
    >
      <ul className={styles.navList}>
        {navItems.map((navItem) => {
          const isOpen = openMenu === navItem.label;
          const isHovered = hoveredId === navItem.id;
          const isActive = itemMatchesPath(navItem, currentPath);
          const hasSubMenus = Boolean(navItem.subMenus?.length);

          return (
            <li
              key={navItem.label}
              className={styles.navItem}
              onMouseEnter={() => hasSubMenus && setOpenMenu(navItem.label)}
              onMouseLeave={() => hasSubMenus && setOpenMenu(null)}
              onFocus={() => hasSubMenus && setOpenMenu(navItem.label)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setOpenMenu(null);
                }
              }}
            >
              {hasSubMenus ? (
                <button
                  type="button"
                  className={`${styles.navTrigger} ${isActive ? styles.navTriggerActive : ""}`}
                  aria-expanded={isOpen}
                  aria-haspopup="menu"
                  onMouseEnter={() => setHoveredId(navItem.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <span>{navItem.label}</span>
                  <ChevronDown
                    className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
                    aria-hidden="true"
                  />
                  {(isHovered || isOpen || isActive) && (
                    <motion.div
                      layoutId="stnp-dropdown-pill"
                      className={styles.hoverBackground}
                    />
                  )}
                </button>
              ) : (
                <Link
                  href={navItem.href}
                  className={`${styles.navLink} ${isActive ? styles.navTriggerActive : ""}`}
                  transitionTypes={
                    getTransitionType ? getTransitionType(currentPath, navItem.href) : undefined
                  }
                  onMouseEnter={() => setHoveredId(navItem.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={(e) => handleLinkClick(e, navItem.href)}
                >
                  <span>{navItem.label}</span>
                  {(isHovered || isActive) && (
                    <motion.div
                      layoutId="stnp-dropdown-pill"
                      className={styles.hoverBackground}
                    />
                  )}
                </Link>
              )}

              <AnimatePresence>
                {isOpen && hasSubMenus ? (
                  <motion.div
                    className={styles.dropdownWrap}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <motion.div
                      className={styles.dropdownPanel}
                      layoutId="stnp-dropdown-panel"
                    >
                      <div className={styles.dropdownInner}>
                        {navItem.subMenus.map((subMenu) => (
                          <div className={styles.groupColumn} key={subMenu.title}>
                            <h3 className={styles.groupTitle}>{subMenu.title}</h3>
                            <ul className={styles.groupList}>
                              {subMenu.items.map((item) => {
                                const Icon = item.icon;
                                const isSubItemActive = hrefMatchesPath(currentPath, item.href);

                                return (
                                  <li key={`${subMenu.title}-${item.label}`}>
                                    <Link
                                      href={item.href}
                                      className={`${styles.subMenuLink} ${
                                        isSubItemActive ? styles.subMenuLinkActive : ""
                                      }`}
                                      transitionTypes={
                                        getTransitionType
                                          ? getTransitionType(currentPath, item.href)
                                          : undefined
                                      }
                                      onClick={(e) => handleLinkClick(e, item.href)}
                                    >
                                      <div className={styles.iconWrap}>
                                        <Icon className={styles.icon} aria-hidden="true" />
                                      </div>
                                      <div className={styles.copyWrap}>
                                        <p className={styles.subMenuLabel}>{item.label}</p>
                                        <p className={styles.subMenuDescription}>
                                          {item.description}
                                        </p>
                                      </div>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default DropdownNavigation;
