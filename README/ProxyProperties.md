## Proxy Properties

Proxy Properties are properties on a model that are equal to properties on another model. The link is two way, so
if one property changes, the other changes with it.

For example if you have a User and Permissions model, and you want the User model to stay
up to date with the role in Permission.

```javascript
var permissions = new Backbone.Model({
                                role: 'admin'
    }),
    user = new Backbone.Model({
                                name: 'Jane',
                                role: ProxyProperty('role', permissions)
    });

console.log('admin' === user.get('role');

permissions.set('role', 'superuser');
console.log('superuser' === user.get('role');

user.set('role', 'consultant');
console.log('consultant' === permissions.get('role');
```

Proxy Properties are tested in `masseuseModelTests.js`.