/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   03-Aug-2022   Arun R      Initial Version             V1

   ** This Page is to define Application main menu   **

============================================================================================================================================================*/

import "./App.css";
import "./Assets/CSS/global.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
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
import FnOrgDefinitionForm from "./pages/master/orgDefinitionForm";
import FnOrgFunctionalLevelReport from "./pages/master/orgFunctionalLevelReport";
import FnCurrenciesReport from "./pages/master/currenciesReport";
import FnOrgSettingsReport from "./pages/master/orgSettingsReport";
import FnNavigationMenuForm from "./pages/navigationMenuForm";
import FnOrgFunctionalHierarchyReport from "./pages/master/orgFunctionalHierarchyReport";
import FnUomReport from "./pages/master/uomReport";
import FnConfigCodesReport from "./pages/master/configCodesReport";
import FnGroupAccessDefinitionForm from "./pages/groupAccessDefinitionForm";
import FnUserAccessDefinitionForm from "./pages/userAccessDefinitionForm";
import FnPerspectivesReport from "./pages/master/perspectivesReport";
import FnScorecardReport from "./pages/master/scoreCardReport";
import FnSettingsForm from "./pages/settings";
import FnDynamicDashboard from "./pages/master/dynamicDashboard";
import FnKpiScoreBoard from "./pages/master/kpiScoreBoard";
import FnKpiDashboard from "./pages/master/kpiDashboard";
import FnKpiActual from "./pages/master/kpiActual";
import FnCSVUpload from "./pages/csvUpload";
import FnChartAttributesSettings from "./pages/master/chartAttributesSettings";
import FnForgotPassword from "./pages/master/forgotPassword";
import FnSmtpConfiguration from "./pages/smtpConfiguration";
import FnSsoConfiguration from "./pages/ssoConfiguration";
import FnScorecardReportGenerator from "./pages/master/scorecardReportGenerator";
import FnTabLayout from "./components/tabLayoutSample";
// ! test
import FnProfilePage from "./pages/profile";
import FnConfiguration from "./pages/configuration";
import FnUser from "./pages/user";

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
                  element={<FnUserAccessDefinitionForm />}
                  path="/user_access_form"
                />
                <Route
                  element={<FnOrgDefinitionForm />}
                  path="/organization_definition"
                />
                <Route
                  element={<FnOrgDefinitionForm />}
                  path="/organization_definition/:id"
                />
                <Route
                  element={<FnOrgFunctionalLevelReport />}
                  path="/organization_functional_level"
                />
                <Route
                  element={<FnOrgFunctionalLevelReport />}
                  path="/organization_functional_level/:id"
                />
                <Route
                  element={<FnOrgSettingsReport />}
                  path="/organization_settings"
                />
                <Route
                  element={<FnOrgSettingsReport />}
                  path="/organization_settings/:id"
                />
                <Route
                  element={<FnOrgFunctionalHierarchyReport />}
                  path="/org_functional_hierarchy"
                />
                <Route
                  element={<FnOrgFunctionalHierarchyReport />}
                  path="/org_functional_hierarchy/:id"
                />
                <Route element={<FnUomReport />} path="/uom_report" />
                <Route element={<FnUomReport />} path="/uom_report/:id" />
                <Route
                  element={<FnConfigCodesReport />}
                  path="/config_codes"
                />
                <Route
                  element={<FnConfigCodesReport />}
                  path="/config_codes/:id"
                />
                <Route
                  element={<FnPerspectivesReport />}
                  path="/perspectives"
                />
                <Route
                  element={<FnPerspectivesReport />}
                  path="/perspectives/:id"
                />
                <Route
                  element={<FnScorecardReport />}
                  path="/scorecard_details"
                />
                <Route
                  element={<FnScorecardReport />}
                  path="/scorecard_details/:id"
                />
                {/* Currencies URL */}
                <Route
                  element={<FnCurrenciesReport />}
                  path="/currencies"
                />
                <Route
                  element={<FnCurrenciesReport />}
                  path="/currencies/:id"
                />

                <Route element={<FnKpiActual />} path="/kpi_actuals" />
                <Route
                  element={<FnKpiActual />}
                  path="/kpi_actuals/:id"
                />

                {/* api dashboard testing */}
                <Route element={<FnDynamicDashboard />} path="/api_dashboard" />
                <Route
                  element={<FnDynamicDashboard />}
                  path="/api_dashboard/:id"
                />

                {/* kpi report */}
                <Route element={<FnKpiScoreBoard />} path="/kpi_report" />
                <Route
                  element={<FnKpiScoreBoard />}
                  path="/kpi_report/:id"
                />

                {/* kpi chart dashboard */}
                <Route element={<FnKpiDashboard />} path="/kpidashboard" />
                <Route
                  element={<FnKpiDashboard />}
                  path="/kpidashboard/:id"
                />

                {/* kpi actual add */}
                <Route
                  element={<FnKpiActual />}
                  path="/kpi_actuals/:id"
                />

                <Route
                  element={<FnKpiActual />}
                  path="/kpi_actuals/:id/:k_id"
                />

                <Route
                element={<FnTabLayout/>}
                path="/testcomp"
                />

                <Route
                  element={<FnChartAttributesSettings />}
                  path="/customize_chart_settings/:id"
                />
                <Route
                  element={<FnSmtpConfiguration />}
                  path="/smtp/:id"
                />
                {/* Test */}
                <Route
                  element={<FnSsoConfiguration />}
                  path="/sso/:id"
                />
                <Route element={<FnSettingsForm />} path="/settings" />
                
                <Route
                  element={<FnScorecardReportGenerator />}
                  path="/ytd_summary_report/:id"
                />
                {/* <Route element={<Fn_settings_form />} path="/settings" /> */}

                <Route element={<FnCSVUpload />} path="/FnCSVUpload" />
              </Route>
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
