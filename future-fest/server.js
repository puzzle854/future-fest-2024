const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb'); // Correção: importando o ObjectId corretamente
const app = express();
const port = 3000;
const methodOverride = require('method-override');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const url = 'mongodb://127.0.0.1:27017/';
const dbName = 'cadastros';
const collectionName = 'contas';

app.get('/Home', (req, res) => {
    res.sendFile(__dirname + '/Home.html');
});

app.get('/cadastro', (req, res) => {
    res.sendFile(__dirname + '/cadastro.html');
});

app.post('/cadastro', async (req, res) => {
    const novoCadastro = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.insertOne(novoCadastro);
        console.log('Conta Registrada com Sucesso.');

        res.redirect('/');
    } catch (err) {
        console.error('Erro ao registrar a conta', err);
        res.status(500).send('Erro ao registrar a conta, por favor, tente novamente mais tarde');
    } finally {
        await client.close();
    }
});

app.get('/atualizar', (req, res) => {
    res.sendFile(__dirname + '/atualizar.html');
});

app.post('/atualizar', async (req, res) => {
    const { id, Nome, Senha } = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { Nome, Senha } }
        );

        if (result.matchedCount > 0) {
            console.log('Conta atualizada com sucesso.');
            res.redirect('/');
        } else {
            res.status(404).send('Conta não encontrada.');
        }
    } catch (err) {
        console.error('Erro ao atualizar a conta', err);
        res.status(500).send('Erro ao atualizar a conta, por favor, tente novamente mais tarde');
    } finally {
        await client.close();
    }
});

app.get('/cadastro/:id', async (req, res) => {
    const { id } = req.params;

    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const cadastro = await collection.findOne({ _id: new ObjectId(id) });

        if (!cadastro) {
            return res.status(404).send('Cadastro não encontrado');
        }

        res.json(cadastro); // Corrigido: envio da variável correta "cadastro" em vez de "livro"
    } catch (err) {
        console.error('Erro ao buscar o cadastro', err);
        res.status(500).send('Erro ao buscar o cadastro, tente novamente mais tarde.');
    } finally {
        await client.close();
    }
});

app.post('/deletar', async (req, res) => {
    const { id } = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount > 0) {
            console.log(`Cadastro com ID: ${id} deletado com sucesso.`);
            res.redirect('/');
        } else {
            res.status(404).send('Cadastro não encontrado.');
        }
    } catch (err) {
        console.error('Erro ao deletar o Cadastro:', err);
        res.status(500).send('Erro ao deletar o Cadastro, tente novamente mais tarde.');
    } finally {
        await client.close();
    }
});

app.get('/cadastros', async (req, res) => {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const cadastros = await collection.find({}, { projection: { _id: 1, Nome: 1, Senha: 1 } }).toArray(); // Corrigido: Variável renomeada para cadastros

        res.json(cadastros); // Corrigido: retorno correto de cadastros
    } catch (err) {
        console.error('Erro ao buscar cadastros:', err);
        res.status(500).send('Erro ao buscar cadastros, por favor, tente novamente mais tarde.');
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Servidor em execução em http://localhost:${port}`);
});
