const site = "/bumphub/";

const route = (event) =>{
	event = event || window.event;
	event.preventDefault();
	window.event.pushState({}, "",event.target.href);
	handleLocation();
}

const routes = {
	404 : "./views/not_found.html",
	"home" : "./views/home.html",
	"" : "./views/home.html",
	"profile" : "./views/profile.html",
	"charts" : "./views/charts.html",
	"artist" : "./artist.html",
	"about" : "./views/about.html",
	"legal" : "./views/legal.html"
}

const handleLocation = async() =>{
	const path = window.location.pathname.replace(site, "");
	const route = (routes[path] ? routes[path] : routes[404]);
	const html = await fetch(route).then((data) => data.text());
	document.getElementById("view").innerHTML = html;
}

window.onpopstate = handleLocation;
window.route = route;

handleLocation();