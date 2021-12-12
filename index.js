const PORT = process.env.PORT || 8000       //fazer deploy no heroku
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()               //abrir o express para ser utilizado
const bcrypt = require('bcrypt')
const cors = require('cors')
app.use(express.json()); // Faz o parse (validação e interpretação) de solicitações do tipo application/json
app.use(express.urlencoded({ extended: true })); // Faz o parse do conteúdo tipo application/x-www-form-urlencoded
app.use(cors())

require('./routes/routes')(app);



const sites = [
    {
        name: 'CNN Travel',
        address: 'https://edition.cnn.com/travel/destinations/scotland',
        base: 'https://edition.cnn.com',
        id: 'cnntravel'
    },
    {
        name: 'European Best Destinations',
        address: 'https://www.europeanbestdestinations.com/',
        base: 'https://www.europeanbestdestinations.com',
        id: 'europeanbestdestinations'
    },
    {
        name: 'BBC Travel',
        address: 'https://www.bbc.com/travel/destinations/scotland',
        base: 'https://www.bbc.com',
        id: 'bbctravel'
    },
    {
        name: 'Planetware',
        address: 'https://www.planetware.com/tourist-attractions/scotland-sco.htm',
        base: 'https://www.planetware.com',
        id: 'planetware'
    },
    {
        name: 'Inspiring Travel Scotland',
        address: 'https://www.inspiringtravelscotland.com/category/scotland/',
        base: '',
        id: 'its'
    }
]

const articles = []
const users = []

const allArt = sites.forEach(site => {
    axios.get(site.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Scotland")', html).each(function() {
                const title = $(this).text().replace(/\t/g,'').replace(/\n/g,'');
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: site.base + url,
                    source: site.name
                })
            })
        })
})

app.use(express.static('public')); //Liga a página html a ser apresentada
app.use(express.json())


app.get('/', (req, res) => {
    res.json('Welcome to my travel tips in Scotland API.')
})

app.get('/articles', (req, res) => {
    res.json(articles)   
})

app.get('/articles/:siteId', (req,res) => {
    // console.log(req.params.siteId)       mostra os params na consola
    const siteId = req.params.siteId

    const siteAddress = sites.filter(site => site.id == siteId)[0].address
    const siteBase = sites.filter(site => site.id == siteId)[0].base
    const siteName = sites.filter(site => site.id == siteId)[0].name

    axios.get(siteAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("Scotland")', html).each(function() {
                const title = $(this).text().replace(/\t/g,'').replace(/\n/g,'')
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: siteBase + url,
                    source: siteName
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`Servidor a correr na porta ${PORT}`))

