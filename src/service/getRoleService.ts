import prisma from "../config/config";

export default async function getRole() {
    try {
        const data = await prisma.role.findMany();

        if(data.length === 0) {
            throw new Error("Role not found");
        }
        return data;
    } catch (error) {
        console.error("Error fetch roles :", error);
        throw new Error("Failed to fetch roles");
    }
}