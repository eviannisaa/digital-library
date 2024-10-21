import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CatalogBook from './pages/CatalogBook'
import CreateBook from './pages/CatalogBook/CreateBook'
import EditBook from './pages/CatalogBook/EditBook'
import BorrowBook from './pages/Borrow'
import FormLoan from './pages/Borrow/FormLoan'
import EditUserBorrow from './pages/Borrow/EditUserBorrow'

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/catalog-book' element={<CatalogBook />} />
        <Route path='/catalog-book/create' element={<CreateBook />} />
        <Route path='/catalog-book/edit/:id' element={<EditBook />} />
        <Route path='/borrow-book' element={<BorrowBook />} />
        <Route path='/borrow-book/form-loan' element={<FormLoan />} />
        <Route path='/borrow-book/edit-user/:id' element={<EditUserBorrow />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
