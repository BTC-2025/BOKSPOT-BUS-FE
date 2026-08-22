const fs = require('fs');

let content = fs.readFileSync('src/lib/store.ts', 'utf8');

const targetAddServiceEnd = `          const res = await fetch(\`\${baseUrl}/services/\${activeMerchantId}\`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!res.ok) {
            const errText = await res.text();
            console.error('Backend rejected addService:', errText);
            alert('Failed to save to database. Error: ' + errText);
          } else {
            const data = await res.json();
          }
        } catch (e) {
          console.error('Failed to sync addService to backend', e);
        }
      },`;

const replacementAddServiceEnd = `          const res = await fetch(\`\${baseUrl}/services/\${activeMerchantId}\`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!res.ok) {
            const errText = await res.text();
            console.error('Backend rejected addService:', errText);
            alert('Failed to save to database. Error: ' + errText);
          } else {
            const data = await res.json();
            const finalService = { ...service, id: data.data?.id || service.id };
            set((state) => ({
              services: [finalService, ...state.services]
            }));
            alert('Success! Category/Service saved to Database.');
          }
        } catch (e) {
          console.error('Failed to sync addService to backend', e);
          alert('Network Error. Could not connect to backend.');
        }
      },`;

content = content.replace(targetAddServiceEnd, replacementAddServiceEnd);

fs.writeFileSync('src/lib/store.ts', content);
console.log('Fixed store.ts alerts');
