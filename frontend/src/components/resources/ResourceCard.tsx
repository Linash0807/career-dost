import { Resource } from "@/lib/resourceService";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, PlayCircle, BookOpen, GraduationCap, FileText } from "lucide-react";

interface ResourceCardProps {
    resource: Resource;
}

const getIcon = (type: string) => {
    switch (type) {
        case "video":
            return <PlayCircle className="h-5 w-5 text-red-500" />;
        case "article":
            return <FileText className="h-5 w-5 text-blue-500" />;
        case "course":
            return <GraduationCap className="h-5 w-5 text-green-500" />;
        case "documentation":
            return <BookOpen className="h-5 w-5 text-purple-500" />;
        default:
            return <ExternalLink className="h-5 w-5" />;
    }
};

const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
        case "beginner":
            return "bg-green-100 text-green-800 hover:bg-green-200";
        case "intermediate":
            return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
        case "advanced":
            return "bg-red-100 text-red-800 hover:bg-red-200";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

export const ResourceCard = ({ resource }: ResourceCardProps) => {
    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <Badge variant="outline" className="mb-2">
                        {resource.category}
                    </Badge>
                    {resource.isPremium && (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                            Premium
                        </Badge>
                    )}
                </div>
                <CardTitle className="text-xl font-bold line-clamp-2 flex items-center gap-2">
                    {getIcon(resource.type)}
                    {resource.title}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {resource.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                    <Badge className={getDifficultyColor(resource.difficulty)} variant="secondary">
                        {resource.difficulty.charAt(0).toUpperCase() + resource.difficulty.slice(1)}
                    </Badge>
                    {resource.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="pt-2">
                <Button asChild className="w-full" variant="default">
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        View Resource <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                </Button>
            </CardFooter>
        </Card>
    );
};
