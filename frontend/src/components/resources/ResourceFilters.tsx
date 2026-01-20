import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResourceFilters as FilterType } from "@/lib/resourceService";
import { Search } from "lucide-react";

interface ResourceFiltersProps {
    filters: FilterType;
    onFilterChange: (key: keyof FilterType, value: string) => void;
}

export const ResourceFilters = ({ filters, onFilterChange }: ResourceFiltersProps) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-card p-4 rounded-lg shadow-sm border">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    placeholder="Search resources..."
                    value={filters.search || ""}
                    onChange={(e) => onFilterChange("search", e.target.value)}
                    className="pl-10"
                />
            </div>

            <div className="flex gap-2 flex-wrap md:flex-nowrap">
                <Select
                    value={filters.category || "all"}
                    onValueChange={(value) => onFilterChange("category", value)}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Frontend">Frontend</SelectItem>
                        <SelectItem value="Backend">Backend</SelectItem>
                        <SelectItem value="DSA">DSA</SelectItem>
                        <SelectItem value="System Design">System Design</SelectItem>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={filters.type || "all"}
                    onValueChange={(value) => onFilterChange("type", value)}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="course">Course</SelectItem>
                        <SelectItem value="documentation">Documentation</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={filters.difficulty || "all"}
                    onValueChange={(value) => onFilterChange("difficulty", value)}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};
