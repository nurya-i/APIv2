const PORT = process.env.PORT || 8000       //fazer deploy no heroku
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')
const app = express()               //abrir o express para ser utilizado

const sites = [
    {
        name: 'sapo',
        address: 'https://www.sapo.pt/noticias/atualidade',
        base: ''
    },
    {
        name: 'sicnoticias',
        address: 'https://sicnoticias.pt/mundo',
        base: 'https://sicnoticias.pt'
    },
    {
        name: 'jn',
        address: 'https://www.jn.pt/mundo.html',
        base: 'https://www.jn.pt'
    },
    {
        name: 'dn',
        address: 'https://www.dn.pt/tag/coronavirus.html',
        base: 'https://www.dn.pt'
    },
    {
        name: 'noticiasaominuto',
        address: 'https://www.noticiasaominuto.com/',
        base: ''
    },
    {
        name: 'observador',
        address: 'https://observador.pt/ultimas/',
        base: ''
    },
    {
        name: 'publico',
        address: 'https://www.publico.pt/coronavirus',
        base: ''
    },
    {
        name: 'tvi24',
        address: 'https://tvi24.iol.pt/tag/covid-19',
        base: 'https://tvi24.iol.pt'
    },
    {
        name: 'cm',
        address: 'https://www.cmjornal.pt/coronavirus/mundo',
        base: 'https://www.cmjornal.pt'
    },
    {
        name: 'dn',
        address: 'https://www.dnoticias.pt/agregador/coronavirus/',
        base: ''
    }
]

const articles = []

sites.forEach(site => {
    axios.get(site.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Covid")', html).each(function() {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: site.base + url,
                    source: site.name
                })
            })
        })
})

app.get('/', (req, res) => {
    res.json('Welcome to my Covid news API in Portuguese')
})

app.get('/news', (req, res) => {
    res.json(articles)   
})

app.get('/news/:siteId', (req,res) => {
    // console.log(req.params.siteId)       mostra os params na consola
    const siteId = req.params.siteId

    const siteAddress = sites.filter(site => site.name == siteId)[0].address
    const siteBase = sites.filter(site => site.name == siteId)[0].base

    axios.get(siteAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("Covid")', html).each(function() {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: siteBase + url,
                    source: siteId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`Servidor a correr na porta ${PORT}`))
