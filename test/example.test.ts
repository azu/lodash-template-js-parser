import { parseTemplate } from "../src/";
import * as assert from "assert";

describe("example", function() {
    it("should return { script, template }", () => {

        const content = `
const age = 18;
<% if (age < 18) { %>
    <li><%- name %> (age: <%- age %>)</li>
<% } else { %>
    <li>over the age limit!</li>
<% }%>
`;
        const { script, template } = parseTemplate(content, {
            templateSettings: {
                interpolate: ["#{", "}"]
            }
        });
        assert.strictEqual(script, `
               
   if (age < 18) {   
            name ;            age ;       
   } else {   
                                
   }  
`);
        assert.strictEqual(template, `
const age = 18;
                    
    <li>            (age:           )</li>
              
    <li>over the age limit!</li>
      
`);

    });
});
