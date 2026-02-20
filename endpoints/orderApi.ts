import axios from "./axiosInstance"

const OrderAPI = {
    createOrder: async(orderData: any) => {
        try {
            const response = await axios.post("/orders/create", orderData);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    getOrder: async(orderId: string) => {
        try {
            const response = await axios.get(`/orders/${orderId}`);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    getOrders: async() => {
        try {
            const response = await axios.get("/orders");
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    cancelOrder: async(orderId: string) => {
        try {
            const response = await axios.post(`/orders/${orderId}/cancel`);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    trackOrder: async(orderId: string) => {
        try {
            const response = await axios.get(`/orders/${orderId}/track`);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    validatePromoCode: async(promoCode: string) => {
        try {
            const response = await axios.post("/orders/validate-promo-code", {promoCode});
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    }
}

export default OrderAPI;
