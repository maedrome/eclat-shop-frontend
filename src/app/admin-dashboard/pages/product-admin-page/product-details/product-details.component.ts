import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Product } from '@products/interfaces/product.interface';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';
import { I18nSelectPipe, TitleCasePipe } from '@angular/common';
import { FormErrorLabelComponent } from "../../../../shared/components/form-error-label/form-error-label.component";
import { ProductsService } from '@products/services/products.service';
import { Router, RouterLink } from '@angular/router';
import { AdminToastService } from '@admin-dashboard/services/admin-toast.service';


@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule, TitleCasePipe, I18nSelectPipe, FormErrorLabelComponent, RouterLink],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent {
  product = input.required<Product>();
  productService = inject(ProductsService);
  toastService = inject(AdminToastService);
  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  genders = ['men', 'women', 'kid', 'unisex'];
  genderMap = {
    'men' : 'men',
    'women': 'women',
    'kid': 'kids',
    'unisex': 'unisex'
  };
  imageFileList : FileList|undefined = undefined;
  tempImages = signal<string[]>([]);
  imagesToCarousel = computed(() => {
    const currentImages = [...this.product().images, ...this.tempImages()];
    return currentImages
  })
  router = inject(Router);
  fb = inject(FormBuilder);
  productForm = this.fb.group({
    title: ['', [Validators.required], []],
    description: ['',[Validators.required],[]],
    slug: ['',[Validators.required, Validators.pattern(FormUtils.slugPattern)],[]],
    price:[0,[Validators.required, Validators.min(0)],[]],
    stock:[0,[Validators.required, Validators.min(0)],[]],
    sizes:[[''],[Validators.required],[]],
    tags:['',[Validators.required],[]],
    gender:['',[Validators.required, Validators.pattern(/men|women|kid|unisex/)],[]],
    images:[[],[],[]]
  })

  fillForm = effect(() => {
    this.setFormValue(this.product())
  })

  setFormValue = (formLike: Partial<Product>) => {
    this.productForm.reset(formLike as any);
    this.productForm.patchValue({tags: this.product().tags.join(', ')})
  }

  toggleSize = (size:string) => {
    const currentSizes = this.productForm.value.sizes ?? [];
    if(currentSizes.includes(size)){
      this.productForm.patchValue({sizes: currentSizes.filter((activeSize) =>  activeSize!==size)})
      return;
    }
    //no actualiza el estado de mi control
    // this.productForm.value.sizes?.push(size); 
    this.productForm.patchValue({sizes: [...currentSizes, size]})
    console.log(this.productForm.value.sizes)
  }

  onSubmit = () => {
    this.productForm.markAllAsTouched();
    console.log(this.product().id)
    if(this.productForm.invalid){
      console.log(this.productForm.get('sizes')?.errors);
      console.log('invalid');
      return;
    }
    const productLike : Partial<Product>  = {
      ...(this.productForm.value as any),
      tags: this.productForm.get('tags')?.value?.split(',').map(tag => tag.trim()) ?? []
    };
    console.log(productLike);
    if(this.product().id == 'new'){
      this.productService.createProduct(productLike, this.imageFileList).subscribe(product => {
        this.router.navigate(['/admin/products/',product.id]);
        this.toastService.show('Product created successfully');
      })
    }else {
      this.productService.updateProduct(this.product().id,productLike,this.imageFileList).subscribe(() => {
        this.toastService.show('Product updated successfully');
      });
    }
  }
  onFilesChanged = (event:Event) => {
    const fileList = (event.target as HTMLInputElement).files;
    this.imageFileList = fileList ?? undefined;
    this.tempImages.set([]);
    const imageUrls = Array.from(fileList ?? []).map(file => URL.createObjectURL(file));
    this.tempImages.set(imageUrls)
  }
}
