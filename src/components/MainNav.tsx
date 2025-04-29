
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";

const MainNav = () => {
  const location = useLocation();
  
  const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/habits", label: "Habits" },
    { href: "/statistics", label: "Statistics" },
    { href: "/achievements", label: "Achievements" },
  ];

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navItems.map((item) => (
          <NavigationMenuItem key={item.href}>
            <Link
              to={item.href}
              className={cn(
                "inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50",
                location.pathname === item.href
                  ? "bg-accent/50 font-medium"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNav;
