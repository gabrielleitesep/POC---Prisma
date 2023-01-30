import prisma from "../db/db.js";

export async function insertBook(title: string, author: string, genre_id: number, contry_id: number) {
    return prisma.books.create({
        data: {
            title,
            author,
            genre_id,
            contry_id
        }
    });;
}

export async function readBooks() {
    return prisma.books.findMany;
}

export async function readBookId(id: number) {
    return prisma.books.findFirst({ where: { id } });
}

export async function alterBook(id: number, title: string, author: string, genre_id: number, contry_id: number) {
    return prisma.books.update({ where: { id }, data: { title, author, genre_id, contry_id } });
}

export async function excludeBook(id: number) {
    return prisma.books.delete({ where: { id } });
}