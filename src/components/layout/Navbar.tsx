'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDashboard, faSignOut, faTasks, faUser } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { loadCurrentUser } from '@/services/authService';
import ThemeController from '../ui/theme/ThemeController';

export default function Navbar() {
  const currentUser = loadCurrentUser();

  return (
    <div className="flex items-center justify-between border-b border-base-300 px-4 py-4 bg-base-300 shadow">
      <div className='flex items-center gap-x-2'>
        <h1 className="text-md font-bold tracking-tight text-base-content/70">TH ENIGX</h1>
      </div>
      <div className="flex gap-2 items-center">
        <ThemeController />

        <div className="dropdown dropdown-end">
          <button className="btn btn-sm btn-primary">
            <FontAwesomeIcon icon={faUser} width={12} />{currentUser?.username}
          </button>
          <ul
            tabIndex={0}
            className="menu dropdown-content bg-base-200 rounded-box z-[10] w-52 p-2 shadow">
            <li>
              <Link href="/main/dashboard">
                <FontAwesomeIcon icon={faDashboard} width={12} /> Dashboard
              </Link>
            </li>
            <li>
              <Link href="/main/tasks">
                <FontAwesomeIcon icon={faTasks} width={12} /> Tasks
              </Link>
            </li>
            <li>
              <Link href="/main/profile">
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
