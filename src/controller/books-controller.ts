import joi, { number } from "joi";
import { Request, Response } from "express";
import { alterBook, excludeBook, insertBook, readBookId, readBooks } from "../repository/books-repository.js";

const booksJOI = joi.object({
    title: joi.string().required(),
    author: joi.string().required(),
    genre_id: joi.number().required().integer().min(1).max(6),
    contry_id: joi.number().required().integer().min(1).max(6)
});

type Book = {
    title: string;
    author: string;
    genre_id: number;
    contry_id: number;

};


export async function postBook(req: Request, res: Response) {

    const { title, author, genre_id, contry_id } = req.body as Book
    const validacao = booksJOI.validate(req.body, { abortEarly: false });

    if (validacao.error) {
        const erros = validacao.error.details.map((d) => d.message)
        res.status(422).send(erros);
        return
    }

    try {

        await insertBook(title, author, genre_id, contry_id);
        res.status(201).send("Livro adicionado!");

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

export async function getBooks(req: Request, res: Response) {

    try {
        const books = await readBooks();

        if (!books) {
            return res.status(404).send("Não existe nenhum livro cadastrado ainda!");
        }

        res.status(200).send(books);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

export async function getBookById(req: Request, res: Response) {

    const { id } = req.params;

    try {
        const activeBook = await readBookId(parseInt(id))

        if (!activeBook) {
            return res.status(404).send("Esse livro não existe!");
        }

        res.status(200).send(activeBook);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

export async function updateBookById(req: Request, res: Response) {

    const { id } = req.params;
    const ID = parseInt(id)
    const { title, author, genre_id, contry_id } = req.body as Book
    const validacao = booksJOI.validate(req.body, { abortEarly: false });

    if (validacao.error) {
        const erros = validacao.error.details.map((d) => d.message)
        res.status(422).send(erros);
        return
    }

    try {

        const activeBook = await readBookId(ID);

        if (!activeBook) {
            return res.status(404).send("Esse livro não existe!");
        }

        await alterBook(ID, title, author, genre_id, contry_id)
        res.status(204).send("Livro atualizado com sucesso!");

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function deleteBookById(req: Request, res: Response) {

    const { id } = req.params;
    const ID = parseInt(id)
    try {

        const activeBook = await readBookId(ID);

        if (!activeBook) {
            return res.status(404).send("Livro não encontrado!");
        }

        await excludeBook(ID)
        res.status(204).send("Livro excluído com sucesso!");

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}