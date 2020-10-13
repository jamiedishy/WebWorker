
const Router = require('./router');

const links = [
       { "name": "My ePortfolio (WIP!)", "url": "http://www.jamiedishy.com" },
       { "name": "My LinkedIn Profile!", "url": "https://www.linkedin.com/in/jamie-dishy-5ba619b1" },
       { "name": "My Github Profile!", "url": "https://www.github.com/jamiedishy" }
   ]

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

function handler(request) {
    const init = {
        headers: { 'content-type': 'application/json' },
    }
    const body = JSON.stringify(links, null, 2)
    return new Response(body, init)
}

async function handleRequest(request) {
    const r = new Router()
    r.get('.*/links', request => handler(request))
    r.get('.*/.*', request => handlerStatic(request)) // return a default message for the root route
    const resp = await r.route(request)
    return resp
}

async function handlerStatic(request) {
    const init = {
        headers: { "content-type": "text/html;charset=UTF-8" },
    }
    const someHost = "https://static-links-page.signalnerve.workers.dev"
    const jsonLinks = JSON.stringify(links)
    return new HTMLRewriter()
        .on("div#links", new LinksTransformer(jsonLinks))
        .on("div#profile", new profileTransformer())
        .on("img#avatar", new imageTransformer())
        .on("h1#name", new nameTransformer())
        // .on("div#social", new socialTransformer())
        .on('title', new titleTransformer)
        .on('body', new bodyTransformer)
        .transform(await fetch(someHost, init))
}

class LinksTransformer {
  constructor(links) {
    this.links = links
  }
  async element(element) {
    links.forEach((el) => {
        element.append(`<a href=${el.url}>${el.name}</a>`, {html: true})
    })
  }
}

class profileTransformer {
  async element(element) {
    element.removeAttribute("style")
  }    
}

class imageTransformer {
  async element(element) {
    element.setAttribute("src", "https://ellehacks.com/2018/assets/team-pictures/ellehacks-team-img-07.png")
  }    
}

class nameTransformer {
  async element(element) {
    element.append("Jamie Dishy")
  }    
}

class socialTransformer {
  async element(element) {
    element.removeAttribute("style")
    element.append(`<div id="links"><a href="https://developers.cloudflare.com/workers/runtime-apis/html-rewriter"><img src=${icon}></a></div>`, {html: true})
    console.log(icon);
    }    
}

class titleTransformer {
  async element(element) {
    element.setInnerContent('Jamie Dishy :)')
  }    
}

class bodyTransformer {
  async element(element) {
    element.setAttribute("style", "background-color: #346beb")
  }    
}