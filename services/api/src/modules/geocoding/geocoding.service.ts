import { GeocodingException } from '@exceptions/geocoding.exception';
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
    this.apiKey = this.configService.getOrThrow<string>('GEOCODING_API_KEY');
  }

  async geocode(address: AddressInput): Promise<Coordinates> {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json';
    const fullAddress = `${address.street}, ${address.zipcode} ${address.city}, ${address.country}`;

    const response = await firstValueFrom(
      this.http.get(url, {
        params: { address: fullAddress, key: this.apiKey },
      }),
    );

    const data = response.data;
    const result = data?.results?.[0];

    console.log(result);

    if (result?.location)
      throw new GeocodingException(
        'Error while converting address to coordinates',
      );

    return {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
    };
  }
}
