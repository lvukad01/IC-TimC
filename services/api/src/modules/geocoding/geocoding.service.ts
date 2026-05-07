import { GeocodingException } from '@errors/geocoding.error';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AddressInput } from '@tstypes/address-input';
import { Coordinates } from '@tstypes/coordinates';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GeocodingService {
  private readonly apiKey: string;

  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.getOrThrow<string>('GEOCODING_API');
  }

  async geocode(address: AddressInput): Promise<Coordinates> {
    const url = 'https://geocode.googleapis.com/v4/geocode/address';

    const params = {
      addressLines: address.street,
      postalCode: address.zipcode,
      locality: address.city,
      countryCode: address.country,
      key: this.apiKey,
    };

    const response = await firstValueFrom(this.http.get(url, { params }));

    const data = response.data;
    const result = data?.results?.[0];

    if (result?.location)
      throw new GeocodingException(
        'Error while converting address to coordinates',
      );

    return {
      lat: result.location.latitude,
      lng: result.location.longitude,
    };
  }
}
