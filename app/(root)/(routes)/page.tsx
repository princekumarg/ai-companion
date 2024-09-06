import { Categories } from "@/components/categories";
import { SearchInput } from "@/components/search-input";
import { Companions } from "@/components/companions";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
interface RootPageProps {
    searchParams: {
        categoryId: string;
        name: string;
    };
}
const RootPage = async ({ searchParams }: RootPageProps) => {
    const { userId } = auth();

    let data;
    if (userId) {
        data = await prismadb.companion.findMany({
            where: {
                categoryId: searchParams.categoryId,
                name: {
                    search: searchParams.name,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                _count: {
                    select: {
                        messages: {
                            where: {
                                userId,
                            },
                        },
                    },
                },
            },
        });
    } else {
        data = await prismadb.companion.findMany({
            where: {
                categoryId: searchParams.categoryId,
                name: {
                    search: searchParams.name,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    const categories = await prismadb.category.findMany();
    return (
        <div className="h-full p-4 space-y-2">
            <SearchInput />
            <Categories data={categories} />
            <Companions data={data} />
        </div>
    )
}
export default RootPage;