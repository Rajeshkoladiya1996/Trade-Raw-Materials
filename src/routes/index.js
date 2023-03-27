import Home from "../containers/home/Home";
import OrderDetails from "../containers/order-details/OrderDetails";
import CustomersList from "../containers/customers-list/CustomersList";
import ModifyOrders from "../containers/modify-orders/ModifyOrders";
import Documents from "../containers/documents/Documents";
import Orders from "../containers/orders/Orders";
import Wallet from "../containers/wallet/Wallet";
import Settings from "../containers/settings/Settings";
import EditProfile from "../containers/settings/EditProfile";
import ResetPassword from "../containers/settings/ResetPassword";
import EditShippingInfo from "../containers/settings/EditShippingInfo";
import ProductsList from "../containers/products-list/ProductsList";
import AddProduct from "../containers/products-list/add-product/AddProduct";
import CategoryList from "../containers/category/categoryList/CategoryList";
import Transporter from "../containers/transporter/Transporter";
import ProductBidList from "../containers/product-bid/ProductBidList";
import AnalysisUser from "../containers/analysis-user/AnalysisUser";
import UserProfileUpdate from "../containers/common/userProfileUpdate/UserProfileUpdate";
import Login from "../containers/auth/Login";
import ForgotPassword from "../containers/auth/ForgotPassword";
import SellProduct from "../containers/sell-product/SellProduct";
import EditSellProduct from "../containers/sell-product/EditSellProduct";
import EditProductBid from "../containers/product-bid/EditProductBid";
import TariffList from "../containers/transporter/tariff/TariffList";
import TariffAdd from "../containers/transporter/tariff/TariffAdd";
import WalletRequestList from "../containers/wallet-request/WalletRequestList";
import THServerError from "../components/THServerError/THServerError";
import OrderInvoice from "../containers/order-invoice/OrderInvoice";
import VerifyOtp from "../containers/auth/VerifyOtp";
import WarehouseList from "../containers/warehouse/WarehouseList";
import AddWarehouse from "../containers/warehouse/AddWarehouse";
import EditWarehouseProduct from "../containers/sell-product/EditWarehouseProduct";
import OpenDispute from "../containers/open-dispute/OpenDispute";
const routeList = [
	{
		id: 1,
		path: "/home",
		name: "Home",
		icon: "ri-home-5-line",
		component: Home,
		isVisible: true,
		isAuth: true,
	},
	{
		id: 2,
		path: "/category",
		name: "Category",
		icon: "ri-function-fill",
		component: CategoryList,
		isVisible: true,
		isAuth: true,
	},
	{
		id: 3,
		path: "/category/add",
		name: "Add Category",
		icon: "ri-list-check-2",
		component: Home,
		isVisible: false,
		isAuth: true,
	},
	{
		id: 4,
		path: "/products",
		name: "Products",
		icon: "ri-list-check-2",
		component: ProductsList,
		isVisible: true,
		isAuth: true,
	},
	{
		id: 5,
		path: "/order/detail/:id",
		name: "Order Detail",
		icon: "",
		component: OrderDetails,
		isVisible: false,
		isAuth: true,
	},
	{
		path: "/order/open-dispute/:id",
		name: "Open Dispute",
		icon: "",
		component: OpenDispute,
		isVisible: false,
		isAuth: true,
	},
	{
		id: 6,
		path: "/customers",
		name: "Customers",
		icon: "ri-user-3-line",
		component: CustomersList,
		isVisible: true,
		isAuth: true,
	},
	{
		id: 7,
		path: "/transporter",
		name: "Transport",
		icon: "ri-truck-line",
		component: Transporter,
		isVisible: true,
		isAuth: true,
	},
	{
		id: 8,
		path: "/analysis-user",
		name: "Analysis User",
		icon: "ri-line-chart-line",
		component: AnalysisUser,
		isVisible: true,
		isAuth: true,
	},
	{
		id: 9,
		path: "/sell-product",
		name: "Sell Product",
		icon: "ri-hand-coin-line",
		component: SellProduct,
		isVisible: true,
		isAuth: true,
	},
	{
		id: 10,
		path: "/product-bid-list",
		name: "Product Bid List",
		icon: "ri-coin-line",
		component: ProductBidList,
		isVisible: true,
		isAuth: true,
	},
	{
		id: 11,
		path: "/changes-status/:id",
		name: "ModifyOrders",
		icon: "",
		component: ModifyOrders,
		isVisible: false,
		isAuth: true,
	},
	{
		id: 12,
		path: "/product/add",
		name: "Add Product",
		icon: "",
		component: AddProduct,
		isVisible: false,
		isAuth: true,
	},
	{
		id: 13,
		path: "/product/:id/edit",
		name: "Add Product",
		icon: "",
		component: AddProduct,
		isVisible: false,
		isAuth: true,
	},
	{
		id: 14,
		path: "/orders",
		name: "Orders",
		icon: "ri-shopping-bag-line",
		component: Orders,
		isVisible: true,
		isAuth: true,
	},
	{
		id: 15,
		path: "/wallet",
		name: "wallet",
		icon: "ri-wallet-line",
		component: Wallet,
		isVisible: true,
		isAuth: true,
	},
	{
		id: 16,
		path: "/wallet-request",
		name: "Wallet requests",
		icon: "ri-wallet-line",
		component: WalletRequestList,
		isVisible: true,
		isAuth: true,
	},
	{
		id: 17,
		path: "/documents",
		name: "Documents",
		icon: "ri-file-list-3-line",
		component: Documents,
		isVisible: true,
		isAuth: true,
	},

	{
		id: 18,
		path: "/setting",
		name: "setting",
		icon: "ri-settings-line",
		component: Settings,
		isVisible: true,
		isAuth: true,
	},
	{
		id: 19,
		path: "/profile",
		name: "Profile",
		icon: "",
		component: EditProfile,
		isVisible: false,
		isAuth: true,
	},
	{
		id: 20,
		path: "/reset-password",
		name: "Reset Password",
		icon: "",
		component: ResetPassword,
		isVisible: false,
		isAuth: true,
	},
	{
		id: 21,
		path: "/edit-shipping-info",
		name: "Edit ShippingInfo",
		icon: "",
		component: EditShippingInfo,
		isVisible: false,
		isAuth: true,
	},
	{
		id: 22,
		path: "/login",
		name: "Login",
		icon: "",
		component: Login,
		isVisible: false,
		isAuth: false,
	},
	{
		id: 23,
		path: "/forgot-password",
		name: "Forgot Password",
		icon: "",
		component: ForgotPassword,
		isVisible: false,
		isAuth: false,
	},
	{
		id: 24,
		path: "/",
		name: "Home",
		icon: "",
		component: Home,
		isVisible: false,
		isAuth: true,
	},
	{
		id: 25,
		path: "/sell-product/:id/edit",
		name: "Sell Product Edit",
		icon: "",
		component: EditSellProduct,
		isVisible: false,
		isAuth: true,
	},
	{
		id: 25,
		path: "/warehouse-product/:id/edit",
		name: "Sell Product Edit",
		icon: "",
		component: EditWarehouseProduct,
		isVisible: false,
		isAuth: true,
	},
	{
		id: 26,
		path: "/product-bid/:id/edit",
		name: "Bud Product Edit",
		icon: "",
		component: EditProductBid,
		isVisible: false,
		isAuth: true,
	},
	{
		id: 27,
		path: "/transporter/:id/tariff-list",
		name: "Transporter tariff list",
		icon: "",
		component: TariffList,
		isVisible: false,
		isAuth: true,
	},
	{
		id: 28,
		path: "/transporter/:id/tariff-add",
		name: "Transporter tariff add",
		icon: "",
		component: TariffAdd,
		isVisible: false,
		isAuth: true,
	},
	{
		id: 29,
		path: "/transporter/:id/:tariff_id/tariff-edit",
		name: "Transporter tariff add",
		icon: "",
		component: TariffAdd,
		isVisible: false,
		isAuth: true,
	},
	
	{
		path: "/server-error",
		name: "Server Error",
		icon: "",
		component: THServerError,
		isVisible: false,
		isAuth: true,
	},
	{
		path: "/order-invoice/:id",
		name: "Order Invoice",
		icon: "",
		component: OrderInvoice,
		isVisible: false,
		isAuth: true,
	},
	{
		path: "/verify-otp/:id",
		name: "Verify OTP",
		icon: "",
		component: VerifyOtp,
		isVisible: false,
		isAuth: false,
	},
	{
		path: "/warehouses",
		name: "Warehouses",
		icon: "ri-store-2-line",
		component: WarehouseList,
		isVisible: true,
		isAuth: true,
	},
	{
		path: "/warehouse/add",
		name: "Add Warehouse",
		icon: "",
		component: AddWarehouse,
		isVisible: false,
		isAuth: true,
	},
	{
		path: "/warehouse/:id/edit",
		name: "Add Warehouse",
		icon: "",
		component: AddWarehouse,
		isVisible: false,
		isAuth: true,
	},
	{
		id: 30,
		path: "/:name/:id/edit",
		name: "User Edit",
		icon: "",
		component: UserProfileUpdate,
		isVisible: false,
		isAuth: true,
	},
];

export default routeList;
