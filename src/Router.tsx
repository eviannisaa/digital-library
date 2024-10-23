import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DetailBook from "./pages/CatalogBook/DetailBook";
import CatalogBook from "./pages/CatalogBook/CatalogBook";
import CreateBook from "./pages/ManageBook/CreateBook";
import EditBook from "./pages/ManageBook/EditBook";
import EditUserBorrow from "./pages/LendingBook/LendingUpdate";
import ListBook from "./pages/ManageBook/ListBook";
import LendingList from "./pages/LendingBook/LendingList";
import LendingForm from "./pages/LendingBook/LendingForm";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog-book" element={<CatalogBook />} />
        <Route path="/catalog-book/manage" element={<ListBook />} />
        <Route path="/catalog-book/create" element={<CreateBook />} />
        <Route path="/catalog-book/edit/:id" element={<EditBook />} />
        <Route path="/catalog-book/detail/:id" element={<DetailBook />} />
        <Route path="/catalog-book/lending-book" element={<LendingList />} />
        <Route path="/lending-book" element={<LendingList />} />
        <Route path="/lending-book/form" element={<LendingForm />} />
        <Route path="/lending-book/edit/:id" element={<EditUserBorrow />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
