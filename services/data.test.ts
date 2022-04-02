import { Data } from './data'

describe('`Data Service`', () => {

    it('should offer `get` and `set`', () => {
        expect(Data.get).toBeDefined();
        expect(Data.set).toBeDefined();
    });

    it('should persist data', () => {
        const animal = 'dog';
        Data.set('fav-animal', animal);
        expect(Data.get('fav-animal')).toBe(animal)
    });

    it('should offer `has`', () => {
        expect(Data.has).toBeDefined();
    });

});