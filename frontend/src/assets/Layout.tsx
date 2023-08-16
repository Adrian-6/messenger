import { Outlet } from "react-router-dom";
import ContactList from "../features/contacts/ContactList";

const Layout = () => {

    return (
        <div className="layout">
            <ContactList />
            <Outlet />
        </div>
    )
}

export default Layout
