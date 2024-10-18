import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeaderBar from "./header";

function AdminLayout() {
    return (
        <div className="flex min-h-screen w-full">
           {/* admin sidebar */}
           <AdminSideBar/>

            <div className="flex flex-1 flex-col">
            {/* admin header */}

            <AdminHeaderBar/>


            <main className="flex-1 flex bg-muted p-4 md:p-6">
                 <Outlet/>

            </main>
              
                
            </div>
        </div>
    );
}

export default AdminLayout;