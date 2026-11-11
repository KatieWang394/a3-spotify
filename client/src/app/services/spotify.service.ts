import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  expressBaseUrl: string = 'http://127.0.0.1:8888';

  constructor(private http: HttpClient) { }

  private sendRequestToExpress(endpoint: string): Promise<any> {

    const uri: string = `${this.expressBaseUrl}${endpoint}`;

    //firstValueFrom generates a Promise for whatever is returned first from the GET request.
    //You shouldn't need to update this part.
    return firstValueFrom(this.http.get(uri)).then((response) => {
      return response;
    }, (err) => {
      return err;
    });
  }

  aboutMe(): Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category: string, resource: string): Promise<ResourceData[]> {
    const endpoint =
      '/search/' + category + '/' + encodeURIComponent(resource);
    return this.sendRequestToExpress(endpoint).then((data) => {
      if (category === 'artist') {
        return data.artists.items.map((item: any) => {
          return new ArtistData(item);
        });
      }
      if (category === 'album') {
        return data.albums.items.map((item: any) => {
          return new AlbumData(item);
        });
      }
      if (category === 'track') {
        return data.tracks.items.map((item: any) => {
          return new TrackData(item);
        });
      }
      return [];
    });
  }

  getArtist(artistId: string): Promise<ArtistData> {
    const endpoint = '/artist/' + encodeURIComponent(artistId);
    return this.sendRequestToExpress(endpoint).then((data) => {
      return new ArtistData(data);
    });
  }

  getTopTracksForArtist(artistId: string): Promise<TrackData[]> {
    const endpoint =
      '/artist-top-tracks/' + encodeURIComponent(artistId);
    return this.sendRequestToExpress(endpoint).then((data) => {
      return data.tracks.map((track: any) => {
        return new TrackData(track);
      });
    });
  }

  getAlbumsForArtist(artistId: string): Promise<AlbumData[]> {
    const endpoint =
      '/artist-albums/' + encodeURIComponent(artistId);
    return this.sendRequestToExpress(endpoint).then((data) => {
      return data.items.map((album: any) => {
        return new AlbumData(album);
      });
    });
  }

  getAlbum(albumId: string): Promise<AlbumData> {
    const endpoint = '/album/' + encodeURIComponent(albumId);
    return this.sendRequestToExpress(endpoint).then((data) => {
      return new AlbumData(data);
    });
  }

  getTracksForAlbum(albumId: string): Promise<TrackData[]> {
    const endpoint =
      '/album-tracks/' + encodeURIComponent(albumId);
    return this.sendRequestToExpress(endpoint).then((data) => {
      return data.items.map((track: any) => {
        return new TrackData(track);
      });
    });
  }

  getTrack(trackId: string): Promise<TrackData> {
    const endpoint = '/track/' + encodeURIComponent(trackId);
    return this.sendRequestToExpress(endpoint).then((data) => {
      return new TrackData(data);
    });
  }
}