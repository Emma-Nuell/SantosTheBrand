import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import AdminAPI from "@/endpoints/adminApi";


export const useAllUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: () => AdminAPI.getAllUsers,
    });
};

export const useUser = (userId: string) => {
    return useQuery({
        queryKey: ["user", userId],
        queryFn: () => AdminAPI.getUser(userId),
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: AdminAPI.updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    })
}

export const useDeleteUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: AdminAPI.deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    })
}

export const useAllOrders = () => {
    return useQuery({
        queryKey: ["orders"],
        queryFn: () => AdminAPI.getAllOrders,
    });
};

export const useOrder = (orderId: string) => {
    return useQuery({
        queryKey: ["order", orderId],
        queryFn: () => AdminAPI.getOrder(orderId),
    });
};

export const useUpdateOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: AdminAPI.updateOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    })
}

export const useDeleteOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: AdminAPI.deleteOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    })
}

export const useAllProducts = () => {
    return useQuery({
        queryKey: ["products"],
        queryFn: () => AdminAPI.getAllProducts,
    });
};

export const useProduct = (productId: string) => {
    return useQuery({
        queryKey: ["product", productId],
        queryFn: () => AdminAPI.getProduct(productId),
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: AdminAPI.updateProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    })
}

export const useDeleteProduct = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: AdminAPI.deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    })
}

export const useAllReviews = () => {
    return useQuery({
        queryKey: ["reviews"],
        queryFn: () => AdminAPI.getAllReviews,
    });
};

export const useReview = (reviewId: string) => {
    return useQuery({
        queryKey: ["review", reviewId],
        queryFn: () => AdminAPI.getReview(reviewId),
    });
};

export const useUpdateReview = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: AdminAPI.updateReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
        },
    })
}

export const useDeleteReview = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: AdminAPI.deleteReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
        },
    })
}

export const useAllCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: () => AdminAPI.getAllCategories,
    });
};

export const useCategory = (categoryId: string) => {
    return useQuery({
        queryKey: ["category", categoryId],
        queryFn: () => AdminAPI.getCategory(categoryId),
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: AdminAPI.updateCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    })
}

export const useDeleteCategory = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: AdminAPI.deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    })
}

export const useAllTags = () => {
    return useQuery({
        queryKey: ["tags"],
        queryFn: () => AdminAPI.getAllTags,
    });
};

export const useTag = (tagId: string) => {
    return useQuery({
        queryKey: ["tag", tagId],
        queryFn: () => AdminAPI.getTag(tagId),
    });
};

export const useUpdateTag = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: AdminAPI.updateTag,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tags"] });
        },
    })
}

export const useDeleteTag = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: AdminAPI.deleteTag,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tags"] });
        },
    })
}

export const useFeatured = () => {
    return useQuery({
        queryKey: ["featured"],
        queryFn: () => AdminAPI.getFeatured,
    });
};

export const useUpdateFeatured = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: AdminAPI.updateFeatured,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["featured"] });
        },
    })
}

export const useDeleteFeatured = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: AdminAPI.deleteFeatured,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["featured"] });
        },
    })
}

export const useTrending = () => {
    return useQuery({
        queryKey: ["trending"],
        queryFn: () => AdminAPI.getTrending,
    });
};

export const useUpdateTrending = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: AdminAPI.updateTrending,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trending"] });
        },
    })
}

export const useDeleteTrending = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: AdminAPI.deleteTrending,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trending"] });
        },
    })
}

export const useGallery = () => {
    return useQuery({
        queryKey: ["gallery"],
        queryFn: () => AdminAPI.getGallery,
    });
};

export const useUpdateGallery = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: AdminAPI.updateGallery,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["gallery"] });
        },
    })
}

export const useDeleteGallery = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: AdminAPI.deleteGallery,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["gallery"] });
        },
    })
}

export const useShowcase = () => {
    return useQuery({
        queryKey: ["showcase"],
        queryFn: () => AdminAPI.getShowcase,
    });
};

export const useUpdateShowcase = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: AdminAPI.updateShowcase,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["showcase"] });
        },
    })
}

export const useDeleteShowcase = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: AdminAPI.deleteShowcase,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["showcase"] });
        },
    })
}

export const useEvents = () => {
    return useQuery({
        queryKey: ["events"],
        queryFn: () => AdminAPI.getEvents,
    });
};

export const useUpdateEvent = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: AdminAPI.updateEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    })
}

export const useDeleteEvent = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: AdminAPI.deleteEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    })
}

export const lockWebsite = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: AdminAPI.lockWebsite,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["websiteStatus"] });
        },
    })
}

export const unlockWebsite = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: AdminAPI.unlockWebsite,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["websiteStatus"] });
        },
    })
}

export const getWebsiteStatus = () => {
    return useQuery({
        queryKey: ["websiteStatus"],
        queryFn: () => AdminAPI.getWebsiteStatus,
    });
};