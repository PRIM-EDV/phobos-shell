import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RegistryService } from './registry.service';

describe('RegistryService', () => {
  let service: RegistryService;
  let httpMock: HttpTestingController;

  // Mock-Daten für die Manifest-Dateien
  const mockFederationManifest = {
    'phobos-auth': 'http://localhost/app/auth/remoteEntry.json',
    'phobos-maptool': 'http://localhost/app/maptool/remoteEntry.json'
  };

  const mockPhobosManifest = {
    'phobos-auth': '/app/auth',
    'phobos-maptool': '/app/maptool'
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
      expect(service['mfes'][0].apiUrl.toString()).toBe('http://localhost/app/auth/api');
      expect(service['mfes'][0].baseUrl.toString()).toBe('http://localhost/app/auth');
    });
  });

  describe('find', () => {
    beforeEach(async () => {
      setTimeout(() => { httpMock.expectOne('federation.manifest.json').flush(mockFederationManifest); });
      setTimeout(() => { httpMock.expectOne('phobos.manifest.json').flush(mockPhobosManifest); });

      await service.hydrate();
    });

    it('should return all MFEs if query is empty', async () => {
      const results = service.find({});
      expect(results.length).toBe(2);
    });

    it('should filter by name correctly', async () => {
      const results = service.find({ name: 'phobos-auth' });
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('phobos-auth');
    });

    it('should return empty array if no match found', async () => {
      const results = service.find({ name: 'non-existent' });
      expect(results.length).toBe(0);
    });
  });
});