import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getResources, ResourceFilters as FilterType } from "@/lib/resourceService";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { ResourceFilters } from "@/components/resources/ResourceFilters";
import { Loader2 } from "lucide-react";

export default function ResourcesPage() {
    const [filters, setFilters] = useState<FilterType>({
        category: "all",
        type: "all",
        difficulty: "all",
        search: "",
    });

    const { data: resources, isLoading, error } = useQuery({
        queryKey: ["resources", filters],
        queryFn: () => getResources(filters),
    });

    const handleFilterChange = (key: keyof FilterType, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Learning Resources Hub</h1>
                <p className="text-muted-foreground">
                    Curated collection of the best resources to master your tech career.
                </p>
            </div>

            <ResourceFilters filters={filters} onFilterChange={handleFilterChange} />

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : error ? (
                <div className="text-center text-red-500 py-8">
                    Error loading resources. Please try again later.
                </div>
            ) : resources?.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">No resources found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources?.map((resource) => (
                        <ResourceCard key={resource._id} resource={resource} />
                    ))}
                </div>
            )}
        </div>
    );
}
