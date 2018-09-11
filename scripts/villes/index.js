var suggestions = document.getElementById('suggestions');
var inputBlock = document.getElementById('inputBlock');
var inputName = document.getElementById('name');
var villesListElt = document.getElementById('villesList');

inputBlock.removeChild(suggestions);
inputName.value = "";

function ajout(sugg){
        
    suggestions.appendChild(sugg);
    suggestions.appendChild(document.createElement('hr'));
        
};

inputName.addEventListener('input', function(e){
        
    suggestions.innerHTML = "";
    if (e.target.value.length >= 2){
        
        inputBlock.appendChild(suggestions);
        
        ajaxGet('/autocompletion/'+e.target.value, function(rep){
            
            rep = JSON.parse(rep);
            
            rep.forEach(function(ville){
                var sugg = document.createElement('div');
                sugg.innerHTML = '<a href = #>' + ville.name + ' (' + ville.department_code + ')' + '</a>';
                ajout(sugg);
                sugg.addEventListener("click", function(e){
        
                    inputName.value = e.target.textContent;
                    inputBlock.removeChild(suggestions);

                });
                sugg.addEventListener('mouseover', function(e){
                    
                    e.target.style.backgroundColor = "rgb(158,199,243)";
                    
                });
                sugg.addEventListener('mouseout', function(e){
                    
                    e.target.style.backgroundColor = "white";
                    
                })
                
            });
            
        });
        
    };
            
});

if (inputName.placeholder==="Cette ville n'existe pas"){
    
    inputName.style.backgroundColor = 'red';
    
}
