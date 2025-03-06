'use client'

import { Bars3Icon } from '@heroicons/react/20/solid'
import { Dispatch, SetStateAction } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut, faUser } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { loadCurrentUser } from '@/services/authService';
import ThemeController from '../ui/theme/ThemeController';

interface HeaderProps {
  setMobileFiltersOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Navbar({ setMobileFiltersOpen }: HeaderProps) {
  const currentUser = loadCurrentUser();

  return (
    <div className="flex items-center justify-between border-b border-base-300 px-4 py-2 bg-primary/10">
      <div className='flex items-center gap-x-2'>
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="btn btn-sm btn-ghost lg:hidden"
        >
          <Bars3Icon aria-hidden="true" className="size-5" />
        </button>
        <h1 className="text-md font-bold tracking-tight text-base-content/70"></h1>
      </div>
      <div className="flex gap-2 items-center">
        <ThemeController />

        <div className="dropdown dropdown-end">
          <button className="btn btn-sm">
            <FontAwesomeIcon icon={faUser} width={12} />{currentUser?.username}
          </button>
          <ul
            tabIndex={0}
            className="menu dropdown-content bg-base-300 rounded-box z-[10] mt-4 w-52 p-2 shadow">
            <li>
              <Link href="/main/settings">
                <FontAwesomeIcon icon={faUser} width={12} /> Profile
              </Link>
            </li>
            <li className='divider-primary'></li>
            <li>
              <Link href="/auth/logout">
                <FontAwesomeIcon icon={faSignOut} width={12} /> Log out
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
