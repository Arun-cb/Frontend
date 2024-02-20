/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   03-Aug-2022   Arun R      Initial Version             V1

   ** This Page is to define Application main menu   **

============================================================================================================================================================*/

import "./App.css";
import "./Assets/CSS/global.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PreProcessing } from "./context/PreContext";
import FnPrivateRoute from "./utils/PrivateRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ChangePassword from "./pages/ChangePassword";
import Active from "./pages/Active";
import CreateUser from "./pages/CreateUser";
import FnCreateUserReport from "./pages/createUserReport";
import FnNavigationMenuForm from "./pages/navigationMenuForm";
import FnGroupAccessDefinitionForm from "./pages/groupAccessDefinitionForm";
import FnSettingsForm from "./pages/settings";
import FnCSVUpload from "./pages/csvUpload";
import FnForgotPassword from "./pages/master/forgotPassword";
import FnSmtpConfiguration from "./pages/smtpConfiguration";
import FnSsoConfiguration from "./pages/ssoConfiguration";
import FnProfilePage from "./pages/profile";
import FnConfiguration from "./pages/configuration";
import FnUser from "./pages/user";
import FnDatabaseConnection from "./pages/databaseconnection";
import FnStepReportBuilder from "./reportBuilder/reportbuilder";
import FnYDataProfiling from "./reportBuilder/ydataprofiling";
import FnDataSource from "./pages/datasource";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <PreProcessing>
            <Routes>
              <Route path="/" element={<FnPrivateRoute />}>
                <Route element={<Home />} path="/" />
                <Route element={<Home />} path="/home/:id" />
                <Route element={<ChangePassword />} path="/changepwd/:id" />
                {/* ! test */}
                <Route element={<FnProfilePage />} path="/user_profile/:id" />
                <Route element={<FnProfilePage />} path="/user_profile/:id/:tab" />
                <Route element={<FnConfiguration />} path="/configuration/:id" />
                <Route element={<Active />} path="/activeuser/:id" />
                <Route element={<CreateUser />} path="/createuser/:id" />
                <Route element={<FnUser />} path="/user/:id" />
                <Route element={<FnDatabaseConnection />} path="/db_connection/:id" />
                <Route
                  element={<FnCreateUserReport />}
                  path="/CreateUser_Report/:id"
                />
                <Route
                  element={<FnNavigationMenuForm />}
                  path="/navigation_menu_form/:id"
                />
                <Route
                  element={<FnGroupAccessDefinitionForm />}
                  path="/group_access_form"
                />
                <Route
                  element={<FnGroupAccessDefinitionForm />}
                  path="/group_access_form/:id"
                />
                <Route
                  element={<FnStepReportBuilder />}
                  path="/rb_builder/:id"
                />

                <Route
                  element={<FnSmtpConfiguration />}
                  path="/smtp/:id"
                />

                <Route
                  element={<FnSsoConfiguration />}
                  path="/sso/:id"
                />

                <Route
                  element={<FnDataSource />}
                  path="/data_source/:id"
                />

                <Route element={<FnSettingsForm />} path="/settings" />

                <Route element={<FnCSVUpload />} path="/FnCSVUpload" />
              </Route>
              {/* Test */}
              <Route
                element={<FnYDataProfiling />}
                path="/data_profiling"
              />
              <Route element={<Login />} path="/login" />

              <Route
                element={<FnForgotPassword />}
                path="/forgot_password"
              />
            </Routes>
          </PreProcessing>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
