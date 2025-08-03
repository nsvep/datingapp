import { 
  Navbar as HeroNavbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from '@heroui/react'

const Navbar = ({ user, onLogout }) => {
  return (
    <HeroNavbar 
      isBordered 
      isBlurred={false}
      className="bg-gradient-to-r from-primary-600 to-secondary-600 fixed top-0 z-50 w-full"
      classNames={{
        wrapper: "max-w-full px-4"
      }}
    >
      <NavbarBrand>
        <p className="font-bold text-white text-xl">💕 DatingApp</p>
      </NavbarBrand>

      <NavbarContent justify="end">
        {user ? (
          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="secondary"
                  name={user.first_name || 'User'}
                  size="sm"
                  src={user.photo_url}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Вы вошли как</p>
                  <p className="font-semibold">{user.first_name} {user.last_name}</p>
                </DropdownItem>
                <DropdownItem key="settings">Настройки</DropdownItem>
                <DropdownItem key="profile_edit">Редактировать профиль</DropdownItem>
                <DropdownItem key="logout" color="danger" onPress={onLogout}>
                  Выйти
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        ) : (
          <NavbarItem>
            <Button color="secondary" variant="flat" size="sm">
              Войти
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
    </HeroNavbar>
  )
}

export default Navbar
