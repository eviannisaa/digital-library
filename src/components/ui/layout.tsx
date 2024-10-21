import React from 'react'
import { Button } from './button'
import { PlusIcon } from '@radix-ui/react-icons'
import BookIcon from '../../assets/icon-book.svg'
import { useNavigate } from 'react-router-dom'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from './breadcrumb'
import { Toaster } from './toaster'

interface LayoutProps {
   cta?: boolean
   create?: boolean
   borrow?: boolean
   submenu?: string
   children: React.ReactNode
   submenus?: { label: string; active: boolean; to?: string }[];
}

const Layout: React.FC<LayoutProps> = ({ cta, create, borrow, submenus, children }) => {
   const navigate = useNavigate()

   return (
      <div className='w-full'>
         <div className='flex justify-between items-center fixed w-full px-8 pt-10 pb-6 z-10 bg-white'>
            <Breadcrumb>
               <BreadcrumbList>
                  <BreadcrumbItem>
                     <BreadcrumbLink href="/">
                        <p className='font-bold text-2xl text-black'>Digital Library</p>
                     </BreadcrumbLink>
                  </BreadcrumbItem>
                  {submenus?.map((menu, i) => (
                     <>
                        <BreadcrumbSeparator
                           key={i}
                           className={menu.active ? 'text-black' : ''}
                        />
                        <BreadcrumbItem>
                           <BreadcrumbLink href={menu.to ?? ''}>
                              <p className={menu.active ? 'text-black' : ''}>
                                 {menu.label}
                              </p>
                           </BreadcrumbLink>
                        </BreadcrumbItem>
                     </>
                  ))}
               </BreadcrumbList>
            </Breadcrumb>

            {cta && (
               <div className='flex flex-row gap-x-16 items-center'>
                  <div className='flex flex-row gap-x-3'>
                     <Button
                        className='font-xs'
                        onClick={() => window.location.href = 'catalog-book'}
                     >
                        <PlusIcon /> Catalog Book
                     </Button>
                     <Button
                        variant="outline"
                        className='font-xs'
                        onClick={() => window.location.href = 'borrow-book'}
                     >
                        <img src={BookIcon} alt='icon book' className='h-5 w-5' /> Borrow Book
                     </Button>
                  </div>
               </div>
            )}
            {create && (
               <Button
                  className='font-xs'
                  onClick={() => navigate('/catalog-book/create')}
               >
                  <PlusIcon /> Create Book
               </Button>
            )}
            {borrow && (
               <Button
                  className='font-xs'
                  onClick={() => navigate('/borrow-book/form-loan')}
               >
                  <PlusIcon /> Borrow
               </Button>
            )}
         </div>
         <div className='px-8'>
            <div className='pb-4 pt-32'>
               {children}
            </div>
            <Toaster />
         </div>
      </div>
   )
}

export default Layout