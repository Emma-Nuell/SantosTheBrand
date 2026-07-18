import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import OrderAPI from "@/endpoints/orderApi";

export const useOrders = () => {
    return useQuery({
        queryKey: ["orders"],
        queryFn: () => OrderAPI.getOrders,
    });
};
export const useOrder = (orderId: string) => {
    return useQuery({
        queryKey: ["order", orderId],
        queryFn: () => OrderAPI.getOrder(orderId),
    });
};

export const useCreateOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: OrderAPI.createOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    })
}

export const useValidatePromoCode = () => {
    return useMutation({
        mutationFn: OrderAPI.validatePromoCode,
    })
}

export const useVerifyPayment = (reference: string | null) => {
    return useQuery({
        queryKey: ["verify-payment", reference],
        queryFn: () => OrderAPI.verifyPayment(reference!),
        enabled: !!reference,
        retry: 2,
        staleTime: Infinity,
    });
};