import User from './User.js';
import Events from './Event.js';
import EventRegistration from './EventRegistration.js';

// EventRegistration belongs to both User and Events
EventRegistration.belongsTo(User, {
	foreignKey: 'customerEmail',
	targetKey: 'email',
	as: 'user' // Optional alias for User
});

EventRegistration.belongsTo(Events, {
	foreignKey: 'eventId',
	targetKey: 'id',
	as: 'event' // ✅ Required alias for correct include usage
});

// Reverse relations (optional)
User.hasMany(EventRegistration, {
	foreignKey: 'customerEmail',
	sourceKey: 'email',
	as: 'registrations'
});

Events.hasMany(EventRegistration, {
	foreignKey: 'eventId',
	sourceKey: 'id',
	as: 'registrations'
});

// Many-to-many relationships (optional)
User.belongsToMany(Events, {
	through: EventRegistration,
	foreignKey: 'customerEmail',
	otherKey: 'eventId',
	as: 'registeredEvents'
});

Events.belongsToMany(User, {
	through: EventRegistration,
	foreignKey: 'eventId',
	otherKey: 'customerEmail',
	as: 'attendees'
});

export { User, Events, EventRegistration };
