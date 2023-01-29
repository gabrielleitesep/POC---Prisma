import joi from "joi";
import { Request, Response } from "express";
import prisma from "../db/db.js";

const booksJOI = joi.object({
    title: joi.string().required(),
    author: joi.string().required(),
    genre_id: joi.number().required().integer().min(1),
    country_id: joi.number().required().integer().min(1)
})

type Book = {
    title: string;
    author: string;
    genre_id: number;
    contry_id: number;

}


export async function postBook (req: Request, res: Response){

    const {title, author, genre_id, contry_id} = req.body as Book
    const validacao = booksJOI.validate(req.body, { abortEarly: false });
    
    if (validacao.error) {
        const erros = validacao.error.details.map((d) => d.message)
        res.status(422).send(erros);
        return
    }

    try {

        await prisma.books.create({
            data: {
                title,
                author,
                genre_id,
                contry_id
            }
        });
        res.status(201).send("Livro adicionado!");

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

export async function getBooks (req: Request, res: Response){

    try {
        const books = await prisma.books.findMany;

        if (!books) {
            return res.status(404).send("Não existe nenhum livro cadastrado ainda!");
        }

        res.status(200).send(books);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

export async function getBookById (req: Request, res: Response){

    const { id } = req.params;

    try {
        const activeBook = await prisma.books.findFirst({where: {id}});

        if (!activeBook) {
            return res.status(404).send("Esse livro não existe!");
        }

        res.status(200).send(activeBook);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

export async function updateBookById (req: Request, res: Response){

    const { id } = req.params;
    const {title, author, genre_id, contry_id} = req.body as Book
    const validacao = booksJOI.validate(req.body, { abortEarly: false });
    
    if (validacao.error) {
        const erros = validacao.error.details.map((d) => d.message)
        res.status(422).send(erros);
        return
    }

    try {

        const activeBook = await prisma.books.findFirst({where: {id}});
        
        if(!activeBook){
            return res.status(404).send("Esse livro não existe!");
        }

        await prisma.books.update({where: {id}, data: {title, author, genre_id, contry_id}});
        res.status(204).send("Livro atualizado com sucesso!");

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function deleteBookById (req: Request, res: Response){

    const { id } = req.params;

    try {

        const activeBook = await prisma.books.findFirst({where: {id}});
        
        if(!activeBook){
            return res.status(404).send("Livro não encontrado!");
        }

        await prisma.books.delete({where: {id}})
        res.status(204).send("Livro excluído com sucesso!");

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}