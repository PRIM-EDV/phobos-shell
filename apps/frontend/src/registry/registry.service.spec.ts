import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RegistryService } from './registry.service';

describe('RegistryService', () => {
  let service: RegistryService;
  let httpMock: HttpTestingController;

  // Mock-Daten für die Manifest-Dateien
  const mockFederationManifest = {
    'phobos-auth': 'http://localhost/auth/remoteEntry.json',
    'phobos-maptool': 'http://localhost/maptool/remoteEntry.json'
  };

  const mockPhobosManifest = {
    'phobos-auth': '/auth',
    'phobos-maptool': '/maptool'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RegistryService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(RegistryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('hydrate', () => {
    beforeEach(async () => {
      setTimeout(() => { httpMock.expectOne('federation.manifest.json').flush(mockFederationManifest); });
      setTimeout(() => { httpMock.expectOne('phobos.manifest.json').flush(mockPhobosManifest); });
      await service.hydrate();
    });

    it('should load manifests into mfes array', async () => {
      expect(service['mfes'].length).toBe(2);
    });

    it('should parse manifests correctly', async () => {
      expect(service['mfes'][0].name).toBe('phobos-auth');
      expect(service['mfes'][0].apiUrl.toString()).toBe('http://localhost/auth/api');
      expect(service['mfes'][0].baseUrl.toString()).toBe('http://localhost/auth');
    });
  });

  describe('find', () => {
    beforeEach(async () => {
      setTimeout(() => { httpMock.expectOne('federation.manifest.json').flush(mockFederationManifest); });
      setTimeout(() => { httpMock.expectOne('phobos.manifest.json').flush(mockPhobosManifest); });

      await service.hydrate();
    });

    it('should return all MFEs if query is empty', async () => {
      const results = await service.find({});
      expect(results.length).toBe(2);
    });

    it('should filter by name correctly', async () => {
      const results = await service.find({ name: 'phobos-auth' });
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('phobos-auth');
    });

    it('should return empty array if no match found', async () => {
      const results = await service.find({ name: 'non-existent' });
      expect(results.length).toBe(0);
    });
  });
});