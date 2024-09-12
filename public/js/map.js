         mapboxgl.accessToken = maptoken;

            const map = new mapboxgl.Map({
                container: 'map', // container ID
                style:"mapbox://styles/mapbox/streets-v12",
                center:listings.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
                zoom: 9 // starting zoom
            });

    
            const marker = new mapboxgl.Marker({color:'Red'})     
            .setLngLat(listings.geometry.coordinates)
            .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h6>${listings.location}</h6><p>Exact! Location provider after booking!</p>`))
            .addTo(map);
           
    