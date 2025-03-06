import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Dispatch, SetStateAction } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'


enum SidebarMenuItemType {
  Title = 1,
  MenuItem,
  Separator,
}

const sideBarMenuItems = [
  {
    name: 'Dashboard',
    href: '/main/dashboard',
    type: SidebarMenuItemType.MenuItem,
  },
  {
    name: 'Tasks',
    href: '/main/tasks',
    type: SidebarMenuItemType.MenuItem,
  },
  {
    name: 'Profile',
    href: '/main/profile',
    type: SidebarMenuItemType.MenuItem,
  },
]

interface SidebarProps {
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: Dispatch<SetStateAction<boolean>>; // setMobileFiltersOpen function type
}


export default function Sidebar({ mobileFiltersOpen, setMobileFiltersOpen }: SidebarProps) {
  const pathname = usePathname();
  return (
    <div className="w-60 h-full hidden lg:flex flex-col bg-neutral-900 p-8 z-10 fixed">
      <div className='grow-0 py-4 border-b border-gray-600'>
        <p className='text-md text-gray-200 font-medium uppercase'>TH ENIGX</p>
        <p className='text-sm text-gray-400'>Autofill Knowledge</p>
      </div>
      <div className='grow overflow-y-auto'>
        <ul className="text-sm mt-4">
          {sideBarMenuItems.map((menuItem) => (
            menuItem.type === SidebarMenuItemType.MenuItem
              ? (
                <Link
                  key={menuItem.name}
                  href={menuItem.href}
                >
                  <li className={`px-4 py-2 rounded-lg border hover:text-blue-600 hover:border-gray-800 duration-300 ${pathname.startsWith(menuItem.href)
                    ? "font-semibold text-blue-500 bg-gray-900 border-gray-800"
                    : "font-normal text-gray-300 border-transparent"
                    }`}
                  >
                    {menuItem.name}
                  </li>
                </Link>
              ) : menuItem.type === SidebarMenuItemType.Title ? (
                <li key={menuItem.name} className="text-gray-500 uppercase font-medium py-2">
                  {menuItem.name}
                </li>
              ) : null
          ))}
        </ul>
      </div>

      <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-neutral-900 py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
          >
            <div className="flex items-center justify-between px-4 border-b border-gray-600">
              <div className='py-4'>
                <p className='text-md text-gray-200 font-medium uppercase'>TH ENIGX</p>
                <p className='text-sm text-gray-400'>Autofill Knowledge</p>
              </div>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="-mr-2 flex size-10 items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            <ul className="text-sm mt-4 px-4">
              {sideBarMenuItems.map((menuItem) => (
                menuItem.type === SidebarMenuItemType.MenuItem
                  ? (
                    <Link
                      key={menuItem.name}
                      href={menuItem.href}
                    >
                      <li className={`px-4 py-2 rounded-md border border-transparent hover:text-blue-600 hover:border-gray-800 ${pathname.startsWith(menuItem.href)
                        ? "font-semibold text-blue-500 bg-gray-900 border-gray-800"
                        : "font-normal text-gray-300"
                        }`}>
                        {menuItem.name}
                      </li>
                    </Link>
                  ) : menuItem.type === SidebarMenuItemType.Title ? (
                    <li key={menuItem.name} className="text-gray-500 uppercase font-medium py-2">
                      {menuItem.name}
                    </li>
                  ) : null
              ))}
            </ul>
          </DialogPanel>
        </div>
      </Dialog>
    </div >
  )
}
